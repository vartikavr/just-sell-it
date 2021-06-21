import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import FlashMessage from 'react-flash-message';

const DisplayBook = () => {

    console.log("book specific page...");
    const [isPending, setPending] = useState(true);
    const [addToWishlist, setAddToWishlist] = useState(false);
    const [message, setMessage] = useState(false);
    const [isWait, setIsWait] = useState(false);

    const { id: productId } = useParams();
    const [book, setBook] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [role, setRole] = useState('');
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        getBook();
    }, [addToWishlist]);

    const getBook = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.get(`${process.env.REACT_APP_URI}/categories/books/${productId}`, {
            //allBooks: books
        }, axiosConfig)
            .then((res) => {
                console.log("book data: ", res.data.book);
                setBook(res.data.book);
                setCurrentUser(res.data.currentUser);
                setRole(res.data.role);
                setWishlistBooks(res.data.wishlistBooks);
                console.log(book, 'successful seed of our book!');
                setPending(false);
            })
            .catch((e) => {
                console.log("client errror data:", e.response);
                if (e.response.data.isLoggedIn == false) {
                    history.push('/login')
                }
                if (e.response.data.isVerified == false) {
                    history.push('/categories')
                }
                console.log("error in client", e)
            })
    }

    const handleDelete = (e) => {
        e.preventDefault();
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.post(`${process.env.REACT_APP_URI}/categories/books/${productId}/delete`, {

        }, axiosConfig)
            .then((res) => {
                console.log('successfully deleted book!');
                history.push('/categories/books');
            })
            .catch((e) => {
                console.log("client errror data:", e.response);
                if (e.response.data.isLoggedIn == false) {
                    history.push('/login')
                }
                if (e.response.data.isOwner == false) {
                    history.push('/categories/books')
                }
                if (e.response.data.isVerified == false) {
                    history.push('/categories')
                }
                console.log("error in client", e)
            })
    }

    const handleBack = () => {
        history.push('/categories/books');
    }

    const handleWishlist = (e) => {
        e.preventDefault();
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.get(`${process.env.REACT_APP_URI}/user/wishlist/books/${productId}/add`, {

        }, axiosConfig)
            .then(() => {
                console.log('successfully added book in wishlist!');
                setAddToWishlist(true);
            })
            .catch((e) => {
                setAddToWishlist(false);
                console.log("client errror data:", e.response);
                if (e.response.data.isLoggedIn == false) {
                    history.push('/login')
                }
                if (e.response.data.isVerified == false) {
                    history.push('/categories')
                }
                console.log("error in client", e)
            })
    }

    const handleChat = (e) => {
        e.preventDefault();
        setIsWait(true);
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.post(`${process.env.REACT_APP_URI}/chat/${productId}`, {
            category: "books"
        }, axiosConfig)
            .then(() => {
                setIsWait(false);
                console.log('successfully message sent!');
                setMessage(true);
            })
            .catch((e) => {
                setMessage(false);
                setIsWait(true);
                console.log("client errror data:", e.response);
                if (e.response.data.isLoggedIn == false) {
                    history.push('/login')
                }
                if (e.response.data.isVerified == false) {
                    history.push('/categories')
                }
                console.log("error in client", e)
            })
    }

    const history = useHistory();

    const handleTab = (event) => {
        const idx = event.target.id;
        setIndex(idx);
    };


    return (
        <div className="displayBook">
            {isPending && <div><h4>Seeding book ...</h4></div>}
            {!isPending &&
                <div className="main-body">
                    <button type="button" className="btn btn-info backBtn mt-3" onClick={handleBack}>
                        All Books
                    </button>
                    <div className="productDisplay">
                        {addToWishlist && (
                            <FlashMessage duration={5000}>
                                <div className="flash-success">
                                    <p>Product added to your wishlist!</p>
                                </div>
                            </FlashMessage>
                        )}
                        {message && (
                            <FlashMessage duration={5000}>
                                <div className="flash-success">
                                    <p>An email has been sent to you. Check inbox!</p>
                                </div>
                            </FlashMessage>
                        )}
                        <div className="details" key={book._id}>
                            <div className="big-img">
                                <img src={book.images[index].url} />
                            </div>
                            <div className="box">
                                <div className="row">
                                    <h3>{book.title}</h3>
                                </div>
                                <h5>Author: {book.author}</h5>
                                <h5>Price: ₹{book.price}</h5>
                                <p style={{ fontSize: 20 }}><b>Seller: </b>{book.userId.username}</p>
                                <p>{book.description}</p>

                                <div className="thumb">
                                    {
                                        book.images.map((img, index) => (
                                            <img src={img.url} id={index} className="product-thumbnail-img"
                                                onClick={handleTab}
                                            />
                                        ))
                                    }
                                </div>
                                {currentUser !== '' && book.userId._id == currentUser && (
                                    <a className="card-link btn btn-info me-2 mt-3" href={`/categories/books/${book._id}/edit`}>Edit</a>
                                )}
                                {currentUser !== '' && (book.userId._id == currentUser || role == "admin") && (
                                    <form className="d-inline" onSubmit={handleDelete}>
                                        <button className="btn btn-danger me-2 mt-3">Delete</button>
                                    </form>
                                )}
                                {currentUser !== '' && book.userId._id !== currentUser && !(wishlistBooks.includes(productId)) && (
                                    <form className="d-inline" onSubmit={handleWishlist}>
                                        <button className="btn btn-info me-2 mt-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-heart" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z" />
                                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                                            </svg>
                                            &nbsp;Add to Wishlist</button>
                                    </form>
                                )}
                                {currentUser !== '' && book.userId._id !== currentUser && (wishlistBooks.includes(productId)) && (
                                    <form className="d-inline">
                                        <button className="btn btn-info disabled me-2 mt-3">Added in Wishlist</button>
                                    </form>
                                )}
                                {currentUser !== '' && (book.userId._id !== currentUser) && !message && !isWait && (
                                    <form className="d-inline" onSubmit={handleChat}>
                                        <button className="btn btn-info me-2 mt-3">Contact Seller</button>
                                    </form>
                                )}
                                {currentUser !== '' && (book.userId._id !== currentUser) && !message && isWait && (
                                    <form className="d-inline">
                                        <button className="btn btn-info me-2 mt-3 disabled">Processing..</button>
                                    </form>
                                )}
                                {currentUser !== '' && (book.userId._id !== currentUser) && message && (
                                    <form className="d-inline">
                                        <button className="btn btn-info me-2 mt-3 disabled">Email sent</button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default DisplayBook;