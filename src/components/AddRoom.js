import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import {
    Alert,
    Jumbotron,
    Spinner,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";
import firebase from "../Firebase";



const AddRoom = () => {

    // variables
    const history = useHistory();
    const [room, setRoom] = useState({ roomname: '' })
    const [showLoading, setShowLoading] = useState(false)
    const ref = firebase.database().ref('rooms/')

    // handle function to save room to firebase
    const save = (e) => {
        e.preventDefault();
        setShowLoading(true)
        // cek roomname with state roomname
        ref.orderByChild('roomname').equalTo(room.roomname).once('value', snapshot => {
            // if roomname already exist, or true
            if (snapshot.exists()) {
                return (
                    <div>
                        <Alert color="primary">
                            Room Name Already Exist!!
                        </Alert>
                    </div>
                )
            }
            // if roomname not exist
            else {
                // select object rooms for add new room object
                const newRoom = firebase.database().ref('rooms/').push()
                newRoom.set(room)
                history.goBack()
                setShowLoading(false)
            }
        })
    }

    // handle on change room input
    const onchange = (e) => {
        e.persist()
        setRoom({ ...room, [e.target.name]: e.target.value })
    }



    return (
        <div>
            {/* jika sedang loading maka menampilkan spinner */}
            {
                showLoading && <Spinner color="primary" />
            }
            <Jumbotron>
                <h2>Create a new room chat</h2>
                <Form onSubmit={save}>
                    <FormGroup>
                        <Label>Room Name</Label>
                        <Input type="text" name="roomname" placeholder="enter roon name" value={room.roomname} onChange={onchange} />
                    </FormGroup>
                    <Button variant="primary" type="submit">
                        Create Room
                    </Button>
                </Form>
            </Jumbotron>
        </div>
    )
}

export default AddRoom
