import api from '../../../utils/api'

import Input from '../../form/Input'

import { useState, useEffect } from 'react'

import styles from './Profile.module.css'
import formStyles from '../../form/Form.module.css'

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage'
import RoundedImage from '../../layout/RoundedImage'

function Profile() {
    const [user, setUser] = useState({})
    const [preview, setPreview] = useState()
    //token from local storage - used in api
    const [token] = useState(localStorage.getItem('token') || '')
    //flash messages
    const { setFlashMessage } = useFlashMessage()

    //get user data using api
    useEffect(() => {
        api
            .get('/users/checkuser', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            })
            .then((response) => {
                setUser(response.data)
            })
    }, [token])

    //form changes
    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    //image file on form change
    function onFileChange(e) {
        //update preview variable
        setPreview(e.target.files[0])
        //update user object
        setUser({ ...user, [e.target.name]: e.target.files[0] })
    }

    //submit buttom
    const handleSubmit = async (e) => {
        e.preventDefault()

        let msgType = 'success'

        //we are using a image here so we need use FormData
        const formData = new FormData()

        //copy user data from user object to formData variable
        await Object.keys(user).forEach((key) =>
            formData.append(key, user[key]),
        )

        //transfer temp variable to Formdata
        //formData.append('user', userFormData)

        const data = await api
            .patch(`/users/edit/${user._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                console.log(response.data)
                return response.data
            })
            .catch((err) => {
                console.log(err)
                msgType = 'error'
                return err.response.data
            })

        setFlashMessage(data.message, msgType)
    }

    return (
        <section>
            <div className={styles.profile_header}>
                <h1>Perfil</h1>
                {(user.image || preview) && (
                    <RoundedImage
                        src={
                            preview
                                ? URL.createObjectURL(preview)
                                : `${process.env.REACT_APP_API}/images/users/${user.image}`
                        }
                        alt={user.name}
                    />
                )}
            </div>
            <form onSubmit={handleSubmit} className={formStyles.form_container}>
                <Input
                    text="Imagem"
                    type="file"
                    name="image"
                    handleOnChange={onFileChange}
                />
                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite o e-mail"
                    handleOnChange={handleChange}
                    value={user.email || ''}
                />
                <Input
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o nome"
                    handleOnChange={handleChange}
                    value={user.name || ''}
                />
                <Input
                    text="Telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnChange={handleChange}
                    value={user.phone || ''}
                />
                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Confirmação de senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirme a sua senha"
                    handleOnChange={handleChange}
                />
                <input type="submit" value="Editar" />
            </form>
        </section>
    )
}

export default Profile