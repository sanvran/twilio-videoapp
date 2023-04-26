import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "./Participant";

const Room = ({ roomName, token, handleLogout }) => {

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [videoMute, setVideoMute] = useState(true);

  let toogleCamera = async () => {
    let localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    // console.log('localStream===>', localStream)
    let videoTrack = await localStream.getTracks().find(track => track.kind === 'video')
    console.log('videoTrack===>', videoTrack)
    if (videoTrack.enabled) {
      videoTrack.enabled = true
    } else {
      videoTrack.enabled = false;
    }
  }

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };
    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };
    Video.connect(token, {
      name: roomName,
      video: true,
      audio: true,
      dominantSpeaker: false,

    }).then((room) => {
      setRoom(room);
      console.log('Successfully joined a room:', room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
    }, function (error) {
      console.log('Unable to connect to room:', error);
    });

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            console.log('trackPublication', trackPublication);
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token, videoMute]);

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <button style={{ backgroundColor: "red" }} onClick={handleLogout}>
        End Virtual Visit
      </button>
      <button style={{ marginTop: 50, backgroundColor: "black" }}
        // onClick={() => setVideoMute(false)}
        onClick={toogleCamera}
      >
        Hide Video
      </button>
      <button style={{ backgroundColor: "black" }} onClick={() => setVideoMute(true)}>
        Show Video
      </button>



      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ""
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
