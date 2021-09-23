import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles';
import MetamaskLogo from './../resources/metamask-fox.svg'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

//Styling config:
const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
  button: {
    background: 'linear-gradient(15deg, #384aff 10%, #f21bf6 95%)',
    '&:hover': {
      background: 'linear-gradient(20deg, #384aff 10%, #f21bf6 60%)',
    },
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(56,74,255, .5)',
    color: 'white',
    height: 35,
    //width: 120,
    padding: '0 10px',
    size: "small",
  },
}));


export default function AddTokenToMetaMask(props) {

  const classes = useStyles();

  const [log, setLog] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  //---Basic metamask integration---
  const addToken = (params) =>
    window.ethereum.request(
      {
        method: 'wallet_watchAsset',
        params
      })
      .then(() => setLog([...log, 'Success, Token added!']))
      .catch((error) => setLog([...log, `Error: ${error.message}`]))


  //TODO: Automatic switching of network
  const switchNetwork = (id) =>
    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: id }],
    })
      .then(() => {
        //setLog([...log, `Switched to ${params[0].chainName} (${parseInt(params[0].chainId)})`])
      })
      .catch((error) => setLog([...log, `Error: ${error.message}`]))

  console.log("chain", window.ethereum.networkVersion);



  //Add BAL token to MM
  function addBal(chainId) {
    switch (chainId) {
      case 'polygon':
        if (window.ethereum.networkVersion === '137') {
          return addToken({
            type: 'ERC20',
            options: {
              address: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
              symbol: 'BAL',
              decimals: 18,
              image: 'https://assets.coingecko.com/coins/images/11683/small/Balancer.png'
            }
          });
        } else {
          return setOpen(true);
        }
      case 'arbitrum':
        if (window.ethereum.networkVersion === '42161') {
          return addToken({
            type: 'ERC20',
            options: {
              address: '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8',
              symbol: 'BAL',
              decimals: 18,
              image: 'https://assets.coingecko.com/coins/images/11683/small/Balancer.png'
            }
          });
        } else {
          return setOpen(true);
        }
      default:
        if (window.ethereum.networkVersion === '1') {
          return addToken({
            type: 'ERC20',
            options: {
              address: '0xba100000625a3754423978a60c9317c58a424e3d',
              symbol: 'BAL',
              decimals: 18,
              image: 'https://assets.coingecko.com/coins/images/11683/small/Balancer.png'
            }
          });
        } else {
          return setOpen(true);
        }
    }
  };

  return (
    <div>
      <Button
        className={classes.button}
        onClick={() => addBal(props.chainId)}
      >
        <Box display="flex" alignItems="center" >
          <img src={MetamaskLogo} alt="Balancer Logo" width="25" />
          <Box ml={0.5}>
            {` Add BAL`}
          </Box>
        </Box>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add BAL Token: Network mismatch
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please make sure that the chosen network on Balancer.tools matches your currently selected network on Metamask.
          </Typography>
        </Box>
      </Modal>
    </div>
  );

}