import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import {
    Jumbotron,
    Spinner,
    Form,
    Button,
    FormGroup,
    Label,
    Input
} from "reactstrap";
import firebase from "../Firebase";

const Login = () => {
    const history = useHistory();
    const [creds, setCreds] = useState({ nickname: '' });
    const [showLoading, setShowLoading] = useState(false);
    const ref = firebase.database().ref('users/');

    // handel on change credentials
    const onChangeCred = (e) => {
        e.persist();
        setCreds({ ...creds, [e.target.name]: e.target.value })
    }

    // handle to submit to realtime firebase database
    const login = (e) => {
        e.preventDefault()
        setShowLoading(true)
        ref.orderByChild('nickname').equalTo(creds.nickname).once('value', snapshot => {
            // jika nickname ada
            if (snapshot.exists()) {
                // setting localstorage nickname dengan data input
                localStorage.setItem('nickname', creds.nickname)
                // redirect ke room list
                history.push('/roomlist')
                // stop loading indicator
                setShowLoading(false)
            }
            // jika tidak ada credential dengan nickname yang di ketik 
            else {
                // buat user baru ke rtd firebase berdasarkan nikname yang di input
                const newUser = firebase.database().ref('users/').push();
                newUser.set(creds);

                // set localstorage
                localStorage.setItem('nickname', creds.nickname);
                // redirect ke room list
                history.push('/roomlist')
                // stop loading indicator
                setShowLoading(false)
            }
        })
    }

    return (
        <div>
            {/* jika sedang loading maka menampilkan spinner */}
            {
                showLoading && <Spinner color="primary" />
            }
            <Jumbotron>
                <Form onSubmit={login}>
                    <FormGroup>
                        <Label>Nickname</Label>
                        <Input type="text" name="nickname" placeholder="enter your nickname" onChange={onChangeCred} />
                    </FormGroup>
                    <Button variant="primary" type="submit" >
                        Login
                    </Button>
                </Form>
            </Jumbotron>
        </div>
    )
}

export default Login
