import { useState, useEffect, useCallback, useContext } from "react";
import * as dropzone from "react-dropzone";

//INTRNAL IMPORT
import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoter.module.scss";
import images from "../assets";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Loader from "@/components/Loader/Loader";
import { createCandidateApi } from '@/api/voter';
import Env from '@/utils/Env';
import { useNavigate } from 'react-router-dom';
import { useMyContract } from '@/hooks/wallet';

const {useDropzone} = dropzone

const AllowedVoters = () => {
  const {writeContractAsync} = useMyContract()
  
  const navigate = useNavigate()
  const [fileUrl, setFileUrl] = useState('');
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });

  const { uploadToIPFS, getNewCandidate, voterArray , loader, setLoader , setError} = useContext(VotingContext);

  //-------------VOTERS
  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0]);

    setFileUrl(url);
  }, [uploadToIPFS]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {image: ["image/*"]},
    maxSize: 5000000,
  });

  useEffect(() => {
    getNewCandidate();
  }, [getNewCandidate]);


  const createVoter = async (formInput, fileUrl) => {
    try {
      setLoader(true);
      const { name, address, position } = formInput;

      const data = await createCandidateApi({name, address, position, fileUrl});

      const url = `${Env.imgDomain}${data.IpfsHash}`;

      await writeContractAsync({
        functionName: 'voterRight',
        args: [address, name, url, fileUrl],
      })
      navigate('/voterList')
    } finally {
      setLoader(false);
      setError("error: Check your API key and data");
    }
  };

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="asset_file" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbsp;{formInput.name}</span>{" "}
              </p>
              <p>
                Add:&nbsp; <span>{formInput.address.slice(0, 20)} </span>
              </p>
              <p>
                Pos:&nbsp;<span>{formInput.position}</span>
              </p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create Candidate For Voting</h4>
              <p>
                Blockchain voting orgainzation, privide ethereum blockchain eco
                system
              </p>
              <p className={Style.sideInfo_para}>Contract Candidate List</p>
            </div>
            <div className={Style.car}>
              {voterArray
                ?.map((el, i) => (
                  <div key={i + 1} className={Style.card_box}>
                    <div className={Style.image}>
                      <img src={el?.image} alt="Profile photo" />
                    </div>

                    <div className={Style.card_info}>
                      <p>
                        {el?.name} #{el?.voterID}
                      </p>
                      <p>{el[0]}</p>
                      <p>Address: {el?.address.slice(0, 10)}..</p>
                    </div>
                  </div>
                ))
                .slice(0, 4)}
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter__container}>
          <h1>Create New Voter</h1>
          <div className={Style.voter__container__box}>
            <div className={Style.voter__container__box__div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className={Style.voter__container__box__div_info}>
                  <p>Upload File: JPG, PNG, GIF, WEBM MAX 100MB</p>

                  <div className={Style.voter__container__box__div__image}>
                    <img
                      src={images.upload}
                      width={150}
                      height={150}
                      alt="file upload"
                    />
                  </div>

                  <p>Drag & Drop File</p>
                  <p>or Browse media on your device</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input__container}>
          <Input
            inputType="text"
            title="Name"
            placeholder="Voter Name"
            handleClick={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Voter Address"
            handleClick={(e) =>
              setFormInput({ ...formInput, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Position"
            placeholder="Voter Position"
            handleClick={(e) =>
              setFormInput({ ...formInput, position: e.target.value })
            }
          />

          <div className={Style.Button}>
            <Button
              btnName="Authorized Voter"
              handleClick={() => createVoter(formInput, fileUrl)}
            />
          </div>
        </div>
      </div>

      <div className={Style.createdVorter}>
        <div className={Style.createdVorter__info}>
          <img src={images.creator} alt="user profile" />
          <p>Notice</p>
          <p>
            Organizer <span>0xf39Fd6e51..</span>
          </p>
          <p>
            Only organizer of the voting contract can create voter and candidate
            for voting election
          </p>
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default AllowedVoters;
