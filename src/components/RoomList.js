import React, { useState, useEffect } from 'react'
import Moment from "moment";
import { useHistory, Link } from "react-router-dom";
import {
    Jumbotron,
    Spinner,
    ListGroup,
    ListGroupItem,
    Button,
} from "reactstrap";
import firebase from "../Firebase";

const RoomList = () => {

    // declare variables
    const [room, setRoom] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [nickName, setNickName] = useState('');
    const history = useHistory();

    useEffect(() => {
        // fetch data roomlist firebase once with useeffect 
        const fetchData = async () => {
            // set current nickname from data in localstorage
            setNickName(localStorage.getItem('nickname'))
            // set data roomlist from rtd firebase to state roomlist
            firebase.database().ref('rooms/').on('value', resp => {
                setRoom([]);
                // resp from firebase is object
                // exctract response from firebase to array
                setRoom(snapShootToArray(resp));
                setShowLoading(false)
            })

        }
        fetchData()
    }, []);

    // convert data object from firebase to array
    const snapShootToArray = (snapshot) => {
        const arr = [];
        snapshot.forEach(element => {
            const item = element.val();
            item.key = element.key;
            arr.push(item)
        });
        return arr;
    }

    // 
    const enterChatRoom = (roomname) => {
        const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
        chat.roomname = roomname;
        chat.nickname = nickName;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.message = `${nickName} enter the room`;
        chat.type = 'join';
        // create new instance chat object
        const newMessage = firebase.database().ref('chats/').push();
        // send new chat
        newMessage.set(chat)

        firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).once('value').then(
            (resp) => {
                let roomuser = [];
                // extract object resp firebase to array
                roomuser = snapShootToArray(resp)
                // cari state nickname ke object roomuser
                const user = roomuser.find(x => x.nickname === nickName)

                // jika nickname ditemukan di room
                if (user !== undefined) {
                    // get data user, similar find in elo laravel :D
                    const userRef = firebase.database().ref(`roomusers/${user.key}`)
                    // update status user is online
                    userRef.update({ status: 'online', src: 'user found', onlineAt: Moment(new Date()).format('DD/MM/YYYY HH:mm:ss') })
                }
                // jika nickname not found in object roomuser
                else {
                    const newroomuser = { roomname: '', nickname: '', status: '' };
                    newroomuser.roomname = roomname;
                    newroomuser.nickname = nickName;
                    newroomuser.status = 'online';
                    newroomuser.onlineAt = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
                    newroomuser.src = "else nickname notfound";
                    // const newroomuser = { roomname: roomname, nickname: nickName, status: 'online' }
                    const newRoomUser = firebase.database().ref('roomusers/').push();
                    newRoomUser.set(newroomuser);
                }

                // redirect to component chatroom
                history.push(`/chatroom/${roomname}`)

            }
        )
    }

    // handle on logout
    const logout = () => {
        localStorage.getItem('nickname');
        history.push('/login')
    }


    return (
        <div>
            {/* jika sedang loading maka menampilkan spinner */}
            {
                showLoading && <Spinner color="primary" />
            }
            <Jumbotron>
                <h3>{nickName} <Button onClick={logout} >Logout</Button></h3>
                <h2>Room List</h2>
                <div>
                    <Link to="/addroom" >Add Room</Link>
                </div>

                {/* map listroom array */}
                <ListGroup>
                    {
                        room.map((item, idx) => (
                            <ListGroupItem key={idx} action onClick={() => {
                                enterChatRoom(item.roomname)
                            }} >
                                {item.roomname}
                            </ListGroupItem>
                        ))
                    }
                </ListGroup>
            </Jumbotron>
        </div>
    )
}

export default RoomList
