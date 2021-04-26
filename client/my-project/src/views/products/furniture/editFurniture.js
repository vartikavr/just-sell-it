import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

const EditFurniture = () => {

    const { id: productId } = useParams();
    const [furniture, setFurniture] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [age, setAge] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [isPending, setPending] = useState(true);
    const [isMount, setMount] = useState(false);

    useEffect(() => {
        getFurniture();
    }, []);

    useEffect(() => {
        checkChanges();
    }, [isMount]);

    const getFurniture = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.get(`http://localhost:5000/categories/furniture/${productId}`, {
        }, axiosConfig)
            .then(async (res) => {
                console.log("furniture data: ", res.data.furniture);
                setFurniture(res.data.furniture);
                console.log(furniture, 'successful seed of our furniture!');
                setMount(true);
                setPending(false);
            })
            .catch((e) => {
                console.log("error in client", e)
            })
    }

    const history = useHistory();

    const checkChanges = () => {
        if (isMount) {
            if (title === '') {
                setTitle(furniture.title);
            }
            if (description === '') {
                setDescription(furniture.description);
            }
            if (age === '') {
                setAge(furniture.age);
            }
            if (price === '') {
                setPrice(furniture.price);
            }
            if (image === '') {
                setImage(furniture.images[0].url);
            }
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setPending(true);

        try {
            const axiosConfig = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            await axios.post(`http://localhost:5000/categories/furniture/${productId}/edit`, {
                title, description, age, price, image
            },
                axiosConfig
            )
                .then((res) => {
                    console.log(res.data);
                    history.push(`/categories/furniture/${productId}`);
                    setPending(false);
                })
                .catch((res, e) => {
                    console.log("error in client", e)
                })
        }

        catch (err) {
            alert(err.response.data.msg)
        }
    }


    return (
        <div className="editFurniture">
            <div className="row mt-3">
                <h1 className="text-center">Edit Furniture</h1>
                {isPending && <div>Seeding furniture ...</div>}
                {!isPending &&
                    <div className="col-md-6 offset-md-3">
                        <form onSubmit={handleSubmit}>
                            <div className="registerForm mb-3">
                                <label className="form-label"><b>Title:</b></label>
                                <input className="form-control" type="text" id="title" name="title" required
                                    defaultValue={furniture.title}
                                    onChange={(event) => setTitle(event.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><b>Price:</b></label>
                                <div className="input-group">
                                    <span className="input-group-text" id="price-label">₹</span>
                                    <input className="form-control" type="number" id="price" name="price" placeholder="0.00" aria-label="price" aria-describedby="price-label" required
                                        defaultValue={furniture.price}
                                        onChange={(event) => setPrice(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><b>Age:</b></label>
                                <input className="form-control" type="number" id="age" name="age" required
                                    defaultValue={furniture.age}
                                    onChange={(event) => setAge(event.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><b>Image Url:</b></label>
                                <input className="form-control" type="text" id="image" name="image" required
                                    defaultValue={furniture.images[0].url}
                                    onChange={(event) => setImage(event.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" ><b>Description:</b></label>
                                <textarea className="form-control" type="text" id="description" name="description" required
                                    defaultValue={furniture.description}
                                    onChange={(event) => setDescription(event.target.value)}
                                ></textarea>
                            </div>
                            {!isPending &&
                                <div className="d-grid gap-2 col-6 mx-auto mb-5">
                                    <button className="btn btn-success">Submit</button>
                                </div>
                            }
                            {isPending &&
                                <div className="d-grid gap-2 col-6 mx-auto mb-5">
                                    <button className="btn btn-success mb-3">Submitting ..</button>
                                </div>
                            }
                        </form>
                    </div>
                }
            </div>
        </div>
    );
}

export default EditFurniture;