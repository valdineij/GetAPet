const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {
    static async register(req, res) {

        const { name, email, phone, password, confirmpassword } = req.body
        //validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória' })
            return
        }
        if (password !== confirmpassword) {
            res.status(422).json({ message: 'A senha e a confirmação de senha precisam ser iguais' })
            return
        }
        //check if user exists
        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.status(422).json({ message: 'O email informado já foi utilizado anteriormente.' })
            return
        }
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })
        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
            //res.status(201).json({ message: 'Usuário criado com sucesso!', newUser })
        } catch (err) {
            res.status(500).json({ message: err })
        }

        //res.status(200).json({ message: 'Tudo ok' })
    }

    static async login(req, res) {
        const { email, password } = req.body
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório.' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória.' })
            return
        }
        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(422).json({ message: 'Não foi encontrado o usuário ou a senha não confere.' })
            return
        }
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            res.status(422).json({ message: 'Não foi encontrado o usuário ou a senha não confere.' })
            return
        }
        await createUserToken(user, req, res)
        //res.status(200).json({ message: 'Deu tudo certo' })
    }

    static async checkUser(req, res) {
        let currentUser
        console.log(req.headers.authorization);

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')
            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined
        } else {
            currentUser = null
        }
        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id
        if (!id) {
            res.status(422).json({ message: 'Falta informar o ID' })
            return
        }
        const user = await User.findById(id).select('-password')
        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado' })
            return
        }
        //user.password = undefined
        res.status(200).json({ user })

    }

    static async editUser(req, res) {
        const id = req.params.id
        console.log(id);
        const { name, email, phone, password, confirmpassword } = req.body

        const token = getToken(req)
        const user = await getUserByToken(token)
        //console.log(req.body);
        //console.log('Algo de errado não está certo');

        let image = ''
        if (req.file) {
            user.image = req.file.filename
        }
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' })
            return
        }
        if (!user) {
            res.status(422).json({ message: 'Usuário inexistente' })
            return
        }
        /*res.status(422).json({ message: 'Usuário inexistente' })
        return*/
        const userExists = await User.findOne({ email: email })
        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Email já utilizado por outro usuário' })
            return
        }
        if (password !== confirmpassword) {
            res.status(422).json({ message: 'A senha e a confirmação de senha precisam ser iguais' })
            return
        } else if (password === confirmpassword && password != null) {
            const salt = await bcrypt.genSalt(12)
            const passwordHash = bcrypt.hashSync(password, salt)
            user.password = passwordHash
        }
        user.name = name
        user.phone = phone
        user.email = email
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )
            res.status(200).json({ message: 'Usuário atualizado com sucesso' })
        } catch (error) {
            res.status(500).json({ message: error })
            return
        }
        //res.status(200).json({ message: 'Tudo certo' })
    }
}