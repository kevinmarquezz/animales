const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes, Op } = require('sequelize');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const secretKey = uuidv4();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const { google } = require('googleapis');
console.log(`La clave secreta es: ${secretKey}`);

const sequelize = new Sequelize('animales', 'ADMIN', 'kevinmarquez2007', {
    host: 'localhost',
    dialect: 'mysql'
});

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "veronicasoledadr97@gmail.com",
        pass: "lxjd phvv whnu ismk"
    }
})

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verificationToken: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    tokenExpires: {
        type: DataTypes.DATE,
        allowNull: true 
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'moderator', 'volunteer'),
        defaultValue: 'user'
    }
}, {
    timestamps: false, 
    createdAt: 'createdAt' 
});
const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    createdAt: 'createdAt',
});

async function syncModels() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Sincronización de modelos completada correctamente.');
    } catch (error) {
        console.error('Error al sincronizar modelos:', error);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

syncModels();

const app = express();
app.use(bodyParser.json());
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// LOGIN

app.post('/register', async (req, res) => {
    const { email, password, name, phone } = req.body;

    let newUser;

    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (existingUser) {
            console.log('Ya hay una cuenta con ese email o número de teléfono.');
            return res.status(400).json({ error: 'Ya hay una cuenta con ese email o número de teléfono.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date();
        tokenExpires.setMinutes(tokenExpires.getMinutes() + 15); 

        newUser = await User.create({
            email,
            password,
            name,
            phone,
            verificationToken: token,
            tokenExpires: tokenExpires
        });

        await sendVerificationEmail(email, token, name);
        
        console.log('Se creó un nuevo usuario.');
        res.status(201).json({ message: 'Usuario creado. Revisa tu correo para verificar tu cuenta.' });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// Función para enviar el correo de verificación
async function sendVerificationEmail(email, token, name) {
    const url = `http://localhost:3000/verificar?token=${token}`;

    let mail = {
        from: "veronicasoledadr97@gmail.com",
        to: email,
        subject: "Verifica tu cuenta",
        text: "Text",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px;">
                    <tr>
                        <td align="center" style="padding: 0px 0; margin: 0; background-color: #73c2ec; color: white; border-radius: 0.5rem; border-bottom-left-radius: 0rem; border-bottom-right-radius: 0rem; height: 8rem;">
                          <div style="display: flex;">
                            <a href='localhost:4200'><img style="width: 10rem" src="https://i.postimg.cc/tCwFwxYd/logo.png" alt="Logo" /><a/>
                            <h1 style="font-size: 35px; padding-top: 2.5rem">¡Hola ${name}!</h1>
                          </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px; justify-content: center; align-items: center; padding-left: 4.5rem; padding-right: 4.5rem; padding-top: 2rem">
                            <p style="font-size: 22px; line-height: 1.5; font-weight: 500; color: #5c4743">
                                ¡Gracias por registrarte en nuestra plataforma!
                            </p>
                            <p style="font-size: 16px; line-height: 1.5; font-weight: 500; text-align: center; color: #5c4743; padding-left: 2rem; padding-right: 2rem">
                                 Este correo es para verificar tu cuenta, hace click en el siguiente botón para validarla.
                            </p>
                            <div style="text-align: center; margin: 30px 0; padding: 10px;">
                                <a href="${url}" style="display: inline-block; background-color: #edea11; color: white; font-weight: bold; padding: 20px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; -webkit-text-stroke-width: 0px;
  -webkit-text-stroke-color: black;">Verificar mi cuenta</a>
                            </div>
                            <p style="font-size: 16px; color: #73c2ec; padding: 0; text-align: center">Si no te registraste en nuestra plataforma, por favor ignora este mensaje.</p>
                            <p style="font-size: 16px; color: #5c4743; padding: 0; padding-left: 4.5rem; padding-top: 2rem; margin-bottom: 3rem">Esta validación va a expirar en 15 minutos.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding: 10px; background-color: #73c2ec; color: white; font-size: 14px">
                            <h1 style="color: white;">¿Recomendaciones?</h1>
                            <p style="color: white;">Mandanos un correo para seguir mejorando juntos.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding: 10px; background-color: #73c2ec; color: white; font-size: 14px; border-radius: 0 0 8px 8px;">
                            © 2024 AnimalesJunin. Todos los derechos reservados.
                        </td>
                    </tr>
                </table>
            </div>
        `,
    }
    
    transporter.sendMail(mail, (error, info) => {
        if(error) {
            console.error("Error sending email: ", error);
        }//end if
        else {
            console.log("Se envió el email de verificación.");
        }//end else
    })
    
    
}

app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        
        console.log('Access Token:', tokens.access_token);
        console.log('Refresh Token:', tokens.refresh_token); // Este es el refresh token que necesitas

        // Aquí puedes guardar el refresh token en tu base de datos si lo deseas
        res.send('Authorization successful! You can close this tab.');
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.send('Error retrieving access token');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                email: email,
                password: password,
                isVerified: true 
            }
        });

        if (user) {
            res.status(200).json({ message: 'Login exitoso', user: user.dataValues });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error al intentar hacer login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/verificar', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) {
            return res.status(400).send('Token inválido o usuario no encontrado');
        }

        if (new Date() > user.tokenExpires) {
            await User.destroy({ where: { id: user.id } });
            return res.status(400).send('El enlace de verificación ha expirado. Registrate nuevamente.');
        }

        user.isVerified = true;
        user.verificationToken = null; 
        await user.save();

        res.send('Tu cuenta ha sido verificada. Ahora puedes iniciar sesión.');
    } catch (error) {
        console.error('Error en la verificación de cuenta:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// USUARIOS / USUARIO

app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
       const user = await User.findOne({
        where: {
          id: id
        }
       })
  
       if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ user: user });
  
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Hubo un error al obtener el usuario' });
  }
})

// LIBROS

app.post('/createBook', upload.single('image'), async (req, res) => {
    // Verifica primero si req.file existe
    if (!req.file) {
        return res.status(400).json({ error: 'La imagen es obligatoria' });
    }

    const { name, genre, author, price } = req.body;
    const imageUrl = req.file.path; // Ahora puedes acceder a req.file.path sin errores

    try {
        const newBook = await Book.create({
            name,
            genre,
            author,
            price,
            imageUrl 
        });

        console.log('Se creó un nuevo libro.');
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error al crear el libro:', error);
        res.status(500).json({ error: 'Error al crear el libro' });
    }
});

app.get('/getBooks', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (error) {
        console.error('Error al obtener partidos:', error);
        res.status(500).json({ error: 'Hubo un error al obtener los partidos' });
    }
});

app.get('/book/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
       const book = await User.findOne({
        where: {
          id: id
        }
       })
  
       if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }
  
      res.status(200).json({ book: book });
  
    } catch (error) {
  
  }
})



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
