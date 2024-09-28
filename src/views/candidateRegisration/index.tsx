import { useState, useCallback, useContext, useEffect } from "react";
import * as dropzone from "react-dropzone";

//INTRNAL IMPORT
import { VotingContext } from "@/context/Voter";
import Style from "@/styles/allowedVoter.module.scss";
import images from "@/assets";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Loader from "@/components/Loader/Loader";
import { useNavigate } from 'react-router-dom';
import { createCandidateApi } from '@/api/voter';
import { useMyContract } from '@/hooks/wallet';
import { useAccount } from 'wagmi';


const {useDropzone} = dropzone

const CandidateRegisration = () => {
  const { address } = useAccount()
  const { writeContractAsync } = useMyContract()
  const [fileUrl, setFileUrl] = useState(null);
  const {
    uploadToIPFSCandidate,
    getNewCandidate,
    candidateArray,
    setLoader,
    setError,
    loader,
  } = useContext(VotingContext);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    age: "",
  });

  const navigate = useNavigate();

  //-------------VOTERS
  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFSCandidate(acceptedFile[0]);
    console.log(url);
    setFileUrl(url);
  }, [uploadToIPFSCandidate]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxSize: 5000000,
  });

  useEffect(() => {
    getNewCandidate();
  }, [address]);



  const setCandidate = async (candidateForm, fileUrl) => {
    const { name, address, age } = candidateForm;
    try {
      if (!name || !address || !age) return console.log("Data Missing");
      setLoader(true);

      const data = await createCandidateApi({name, address, avatar: fileUrl, age})

      await writeContractAsync({
        functionName: 'setCandidate',
        args: [address, age, name, fileUrl, data.toString()],
      })
      navigate('/')
    } catch (error) {
      console.log(error)
      setError("Something went wrong, check your API Key");
    } finally {
      setLoader(false);
    }
  }

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="asset_file" />
            <div className={Style.voterInfo_paragraph}>
              <p>Name: <span>&nbsp;{candidateForm.name}</span></p>
              <p>Add:&nbsp; <span>{candidateForm.address.slice(0, 20)} </span></p>
              <p>age:&nbsp;<span>{candidateForm.age}</span></p>
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
              {candidateArray
                ?.map((el, i) => (
                  <div key={i + 1} className={Style.card_box}>
                    <div className={Style.image}>
                      <img src={el?.image} alt="Profile photo" />
                    </div>

                    <div className={Style.card_info}>
                      <p>Age: {el?.age}</p>
                      <p>ID: #{el?.candidateID}</p>
                      <p>Address: {el?.address.slice(0, 7)}..</p>
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
          <h1 className="mv-24">Register New Candidate</h1>
          <div className={Style.voter__container__box}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={Style.voter__container__box__div_info}>
                <p className='mv-20'>Upload File: JPG, PNG, GIF, WEBM MAX 100MB</p>
                <div>
                  <img
                    style={{width: '150px', height: '150px'}}
                    src={images.upload}
                    alt="file upload"
                    />
                </div>

                <p className='mv-12'>Drag & Drop File</p>
                <p className='mb-20'>or Browse media on your device</p>
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
              setCandidateForm({ ...candidateForm, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Voter Address"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Age"
            placeholder="Voter Position"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, age: e.target.value })
            }
          />

          <div className='text-end'>
            <Button
              btnName="Authorized Candidate"
              handleClick={() => setCandidate(candidateForm, fileUrl)}
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

export default CandidateRegisration;
