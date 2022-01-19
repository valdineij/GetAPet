import api from '../../../utils/api'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import styles from './AddPet.module.css'

import PetForm from '../../form/PetForm'

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage'

function EditPet() {
    //holds the pet object
    const [pet, setPet] = useState({})
    //token 
    const [token] = useState(localStorage.getItem('token') || '')
    //pet id passed thru dinamic route
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()

    // get ped data from api ony when token and pet id changes
    useEffect(() => {
        api
            .get(`/pets/${id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            })
            .then((response) => {
                setPet(response.data.pet)
            })
    }, [token, id])

    async function updatePet(pet) {
        let msgType = 'success'

        //form data because we need to send imagedata
        const formData = new FormData()
        console.log(pet);

        // iterate pet object keys and append data to formData array
        await Object.keys(pet).forEach((key) => {
            if (key === 'images') {

                for (let i = 0; i < pet[key].length; i++) {
                    formData.append(`images`, pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        //send formdata to api and return response.data
        const data = await api
            .patch(`pets/${pet._id}`, formData, {
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
            <div className={styles.addPet_header}>
                <h1>Editando o Pet: {pet.name}</h1>
                <p>Depois da edição os dados serão atualizados no sistema</p>
            </div>
            {pet.name && (
                <PetForm handleSubmit={updatePet} petData={pet} btnText="Editar" />
            )}
        </section>
    )
}

export default EditPet