import { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import { io, Socket } from "socket.io-client";

let socket: Socket;

const useWebRTC = (stream: MediaStream | null, otherUserId: string | null) => {
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [signalData, setSignalData] = useState<string>("");
  const [queuedSignalData, setQueuedSignalData] = useState<any | null>(null);
  const [userId, setUserId] = useState<string>(""); // Track user ID
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  if (!socket) {
    socket = io("http://localhost:3001");
  }

  // peer signaling + user id
  useEffect(() => {
    socket.on("connect", () => {
      const id = socket.id || "";
      setUserId(id);
    });

    socket.on("signal", (data) => {
      if (peer) {
        peer.signal(data.signal);
      } else {
        setQueuedSignalData(data.signal);
      }
    });

    return () => {
      socket.off("signal");
    };
  }, [peer]);

  const initiateCall = (isInitiator: boolean) => {
    if (!stream) return;

    const newPeer = new Peer({
      initiator: isInitiator,
      trickle: false,
      stream,
    });

    newPeer.on("signal", (data: any) => {
      setSignalData(JSON.stringify(data));
      if (otherUserId) {
        socket.emit("signal", { signal: data, to: otherUserId });
      }
    });

    newPeer.on("stream", (remoteStream) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
      }
      setIsConnected(true);
    });

    newPeer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    setPeer(newPeer);

    if (queuedSignalData) {
      newPeer.signal(queuedSignalData);
      setQueuedSignalData(null);
    }
  };

  const handleSignalData = (signalData: string) => {
    if (peer) {
      try {
        const parsedSignal = JSON.parse(signalData);
        peer.signal(parsedSignal);
      } catch (error) {
        console.error("Invalid JSON input:", error);
        alert("Invalid signaling data. Please enter valid JSON.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, [peer]);

  return {
    peer,
    isConnected,
    signalData,
    userId,
    remoteAudioRef,
    initiateCall,
    handleSignalData,
  };
};

export default useWebRTC;
