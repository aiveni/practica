const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const Todo = require('../models/Todo');
const User = require('../models/user');

router.post('/login',
    [
        body('username').trim().notEmpty().escape(),
        body('password').trim().notEmpty().escape(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const user = await User.findOne({ username: req.body.username });
            if (user) {
                const passwordMatch = await bcrypt.compare(req.body.password, user.password);
                if (passwordMatch) {
                    req.session.userid = req.body.username
                    res.redirect('/protected');
                } else {
                    res.redirect('/');
                }
            } else {
                res.redirect('/');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
        }
    }
);

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // El segundo argumento es el número de rondas de hashing

        // Crear un nuevo usuario con la contraseña hasheada
        const newUser = new User({ username, password: hashedPassword });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        console.log('Usuario registrado con éxito');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
 


//add tarea
router.post('/add/todo', (req, res) => {
    const { todo } = req.body;
    const newTodo = new Todo({todo});
    newTodo.save()
    .then( () => {
        console.log('guardado');
        res.redirect('/protected');
    })
    .catch(err => console.log(err));
})


.get('/delete/todo/:_id', (req, res) => {
    const { _id } = req.params;
    Todo.deleteOne({_id})
    .then( () => {
        console.log('guardado');
        res.redirect('/protected');
    })
    .catch(err => console.log(err));
});

module.exports = router;