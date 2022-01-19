import api from '../../../utils/api'

import { useState, useEffect } from 'react'

import styles from './Dashboard.module.css'

import RoundedImage from '../../layout/RoundedImage'

function MyAdoptions() {
    //holds pet list from api
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')

    //useEffect to get petlist from API
    useEffect(() => {
        api
            .get('/pets/myadoptions', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            })
            .then((response) => {
                setPets(response.data.pets)
            })
    }, [token])

    return (
        <section>
            <div className={styles.petslist_header}>
                <h1>Minhas adoções</h1>
            </div>
            {/*Uses same css from dashboard */}
            <div className={styles.petslist_container}>
                {/*if there is pets use map to show them */}
                {pets.length > 0 &&
                    pets.map((pet) => (
                        <div key={pet._id} className={styles.petlist_row}>
                            {pet.images.length > 0 &&
                                <RoundedImage
                                    src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                                    alt={pet.name}
                                    width="px75"
                                />}
                            <span className="bold">{pet.name}</span>
                            <div className={styles.contacts}>
                                <p>
                                    <span className="bold">Ligue para:</span> {pet.user.phone}
                                </p>
                                <p>
                                    <span className="bold">Fale com:</span> {pet.user.name}
                                </p>
                            </div>
                            <div className={styles.actions}>
                                {pet.available ? (
                                    <p>Adoção em processo</p>
                                ) : (
                                    <p>Parabéns por concluir a adoção</p>
                                )}
                            </div>
                        </div>
                    ))}
                {pets.length === 0 && <p>Ainda não há pets adotados!</p>}
            </div>

        </section>
    )
}
export default MyAdoptions