import { useState } from "react"
import Input from "./Input"
import formStyle from './Form.module.css'
import Select from "./Select"

function PetForm({ handleSubmit, petData, btnText }) {
    const [pet, setPet] = useState(petData || {})
    const [preview, setPreview] = useState([])
    const colors = ["Branco", "Preto", "Cinza", "Caramelo", "Mesclado"]

    function onFileChange(e) {
        console.log(Array.from(e.target.files))
        //update Preview state - using array
        setPreview(Array.from(e.target.files))
        setPet({ ...pet, images: [...e.target.files] })
        //update pet images
    }

    function handleChange(e) {
        setPet({ ...pet, [e.target.name]: e.target.value })
        //update pet state
    }

    function handleColor(e) {
        //update pet state color due to select control 
        setPet({
            ...pet,
            color: e.target.options[e.target.selectedIndex].text,
        })
    }

    const submit = (e) => {
        console.log('submit do petform');

        //stop submit
        e.preventDefault()
        //call submit function with pet object as a parameter
        handleSubmit(pet)
    }
    return (
        <form className={formStyle.form_container} onSubmit={submit}>
            <div className={formStyle.preview_pet_images}>
                {/* Handle preview images - from those files that will be sent to database */}
                {/* and the images that came from database - pet.images*/}
                {preview.length > 0
                    ? preview.map((image, index) => (
                        <img
                            src={URL.createObjectURL(image)}
                            alt={pet.name}
                            key={`${pet.name}+${index}`}
                        />
                    ))

                    : pet.images &&
                    pet.images.map((image, index) => (

                        <img
                            src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                            alt={pet.name}
                            key={`${pet.name}+${index}`}
                        />
                    ))}
            </div>
            <Input
                text="Imagens do Pet"
                type="file"
                name="images"
                handleOnChange={onFileChange}
                multiple={true}
            />
            <Input
                text="Nome do Pet"
                type="text"
                name="name"
                placeholder="Digite o nome"
                handleOnChange={handleChange}
                value={pet.name || ''}
            />
            <Input
                text="Idade do Pet"
                type="number"
                name="age"
                placeholder="Digite a idade"
                handleOnChange={handleChange}
                value={pet.age || ''}
            />
            <Input
                text="Peso do Pet"
                type="number"
                name="weight"
                placeholder="Digite o peso aproximado"
                value={pet.weight || ''}
                handleOnChange={handleChange}
            />
            <Select
                name="color"
                text="Selecione a cor do Pet"
                options={colors}
                handleOnChange={handleColor}
                value={pet.color || ''}
            />
            <input type="submit" value={btnText} />
        </form>
    )
}

export default PetForm