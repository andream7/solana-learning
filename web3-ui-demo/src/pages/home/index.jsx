import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Connection,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import React, { useState } from "react";
import { useRef } from "react";
import Layout from "../../layouts";
import { enqueueSnackbar } from "notistack";

const PRIVATE_KEY =
  "[24,xxx,119]";
const TO_PUBLIC_KEY = "Czorr4y9oFvE3VdfCLVFuKDYxaNUG1iyQomR7kMZUuzi";
const ENDPOINT_URL = "https://api.devnet.solana.com";

export default function HomePage() {
  const [privateKey, setPrivateKey] = useState(PRIVATE_KEY);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState(0);
  const [toPublicKey, setToPublicKey] = useState(TO_PUBLIC_KEY);
  const [toCount, setToCount] = useState(10000000);
  const [account, setAccount] = useState("");
  const keyPair = useRef();
  const connection = new Connection(ENDPOINT_URL);
  // custom button
  const [open, setOpen] = useState(false);

  const onToPublicKey = (e) => {
    setToPublicKey(e.target.value);
  };

  const onToCount = (e) => {
    setToCount(e.target.value * LAMPORTS_PER_SOL);
  };

  const onTransfer = async () => {
    enqueueSnackbar(`transfer to ${toPublicKey} ${toCount} SOL`);
    const txInstructions = [
      SystemProgram.transfer({
        fromPubkey: keyPair.current.publicKey, //this.publicKey,
        toPubkey: new PublicKey(toPublicKey), //destination,
        lamports: toCount, //amount,
      }),
    ];

    let latestBlockhash = await connection.getLatestBlockhash("finalized");
    enqueueSnackbar(
      `   ✅ - Fetched latest blockhash. Last Valid Height: 
      ${latestBlockhash.lastValidBlockHeight}`
    );

    const messageV0 = new TransactionMessage({
      payerKey: keyPair.current.publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: txInstructions,
    }).compileToV0Message();

    const trx = new VersionedTransaction(messageV0);
    trx.sign([keyPair.current]);
    return await connection.sendTransaction(trx);
  };

  const onBalance = () => {
    connection.getBalance(keyPair.current.publicKey).then((balance) => {
      enqueueSnackbar(`${publicKey} has a balance of ${balance/LAMPORTS_PER_SOL}`);
      setBalance(balance);
    });
  };

  const onImport = () => {
    let secretKey = Uint8Array.from(JSON.parse(privateKey));
    keyPair.current = Keypair.fromSecretKey(secretKey);
    enqueueSnackbar(`import account: ${keyPair.current.publicKey.toString()}`);
    setPublicKey(keyPair.current.publicKey.toString());
  };

  const onPrivateKey = (e) => {
    enqueueSnackbar(`private: ${e.target.value}`);
    setPrivateKey(e.target.value);
  };

  const handleSubmit = () => {
    enqueueSnackbar(`submit: ${privateKey}`);
    setOpen(false);
  };



  return (
    <Layout >
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
           Web3JS Demo 
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
          </Typography>


          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Container>
              <React.Fragment>
                <TextField
                  multiline
                  label="privateKey"
                  onChange={onPrivateKey}
                />
                <Button onClick={onImport}> import </Button>
              </React.Fragment>
              <React.Fragment>
                <p> PublicKey: {publicKey} </p>
              </React.Fragment>
              <React.Fragment>
                <span>Balance:{balance / LAMPORTS_PER_SOL} </span>
                <Button onClick={onBalance}> Query Balance </Button>
              </React.Fragment>
              <React.Fragment>
                <div>
                  <TextField label="To" onChange={onToPublicKey} />
                  <TextField label="Count" onChange={onToCount} />
                  <Button onClick={onTransfer}> Transfer </Button>
                </div>
              </React.Fragment>
            </Container>
          </Stack>
        </Container>
      </Box>
      {/* private key input dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Input Your PrivateKey</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To continue the demo, please enter your Private Key here.
          </DialogContentText>
          <TextField
            autoFocus
            onChange={(e) => setPrivateKey(e.target.value)}
            margin="dense"
            id="name"
            label="Private Key"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
