import styles from './AddPet.module.css'
import api from "../../../utils/api";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useFlashMessage from "../../../hooks/useFlashMessage";
import PetForm from '../../form/PetForm';

function AddPet() {
    const { setFlashMessage } = useFlashMessage()
    const [token] = useState(localStorage.getItem('token') || '')
    const navigate = useNavigate()

    async function registerPet(pet) {

        let msgType = 'success'

        const formData = new FormData()

        /*Get pet data and copy it to formData */
        const petFormData = await Object.keys(pet).forEach((key) => {
            if (key === 'images') {
                for (let i = 0; i < pet[key].length; i++) {
                    formData.append(`images`, pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        formData.append('pet', petFormData)
        /*Send data to api with autorization token in header - from localstorage*/
        const data = await api
            .post(`pets/create`, formData, {
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
        if (msgType !== 'error') {
            navigate('/pet/mypets')
        }
    }
    return (
        <section className={styles.addPet_header}>
            <div>
                <h1>Cadastre um Pet</h1>
                <p>Depois ele estará disponível para adoção</p>
            </div>

            <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet" />

        </section>
    )
}

export default AddPet