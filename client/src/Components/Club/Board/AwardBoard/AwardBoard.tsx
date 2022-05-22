import { useCallback, useRef } from 'react';
import { useEffect, useState } from 'react';
import Button from '../../../Button/Button';
import FloatInput from '../../../Input/Input';
import { AwardBoardContainer, AwardListContainer } from './style';
import { useDropzone } from 'react-dropzone';
import fileUploadImg from '../../../../Assets/파일 업로드.png';
import { DropZoneDiv } from './style';
import axios from 'axios';
import AWS from 'aws-sdk';
import { toast } from 'react-toastify';
import { AwardPostType } from '../../../../Types/PostType';
import DropZone from '../../../DropZone/DropZone';

interface Props {
  clubId: number;
}
const AwardBoard = (props: Props) => {
  const { clubId } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const awardNameRef = useRef<HTMLInputElement>(null);
  const awardTitleRef = useRef<HTMLInputElement>(null);
  const awardContentRef = useRef<HTMLTextAreaElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<Blob | null>(null);
  const [awardPosts, setAwardPosts] = useState<AwardPostType[]>([]);
  const option = {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  };
  const s3 = new AWS.S3(option);
  const param = {
    Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME ?? '',
    ACL: 'public-read',
    ContentType: `image/jpeg`,
    Key: `user/profile/${new Date().toString()}.png`,
    Body: file ?? '',
  };
  const notify = () =>
    toast('모든 정보를 입력해주세요', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const submit = async () => {
    if (
      !(awardNameRef.current && awardNameRef.current.value !== '') ||
      !(awardTitleRef.current && awardTitleRef.current.value !== '') ||
      !(awardContentRef.current && awardContentRef.current.value !== '') ||
      !image
    ) {
      notify();
      return;
    } else {
      await s3
        .upload(param)
        .promise()
        .then((data) => {
          axios
            .post(`${process.env.REACT_APP_SERVER_URL}/awards`, {
              clubIdx: clubId,
              competitionName: awardTitleRef.current?.value,
              awardName: awardNameRef.current?.value,
              content: awardContentRef.current?.value,
              path: data.Location,
            })
            .then(() => {
              setIsOpen(false);
            });
        });
    }
  };
  const handleModalClose = (e: MouseEvent) => {
    if (isOpen && !modalRef.current?.contains(e.target as Node)) {
      setIsOpen(false);
      setImage(null);
    }
  };
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/awards/club/${clubId}`).then((res) => {
      console.log(res);
      setAwardPosts(res.data.res.awards);
    });
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;`;
    }
    window.addEventListener('click', handleModalClose);
    return () => {
      window.removeEventListener('click', handleModalClose);
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, [isOpen]);
  return (
    <AwardBoardContainer>
      <div>
        <div className="navigator">
          <span>Home</span>
          <span>{'>'}</span>
          <span>수상 게시판</span>
        </div>
        <AwardListContainer>
          {awardPosts.map((award) => (
            <div>
              <img src={award.path} />
              <div>
                <span>{award.awardName}</span>
                <span>
                  <pre>{award.awardContent}</pre>
                </span>
              </div>
            </div>
          ))}
        </AwardListContainer>
      </div>
      <Button name="등록" clickEvent={() => setIsOpen(true)} />
      {isOpen && (
        <div className="modal-background">
          <div className="modal" ref={modalRef}>
            <span>수상 내역 등록</span>
            <div>
              <div>
                <FloatInput inputRef={awardTitleRef} name="대회" type="midium"></FloatInput>
                <FloatInput inputRef={awardNameRef} name="상" type="midium"></FloatInput>
                <span>사진</span>
                <DropZone setFile={setFile} setImage={setImage}>
                  {!image ? (
                    <img src={fileUploadImg} width="30px" height="27px" />
                  ) : (
                    <img
                      src={image}
                      style={{
                        width: '16.5rem',
                        height: '8.938rem',
                        marginBottom: '15px',
                        borderRadius: '5px',
                      }}
                    />
                  )}
                </DropZone>
              </div>
              <div>
                <span>내용</span>
                <textarea ref={awardContentRef}></textarea>
              </div>
            </div>
            <div>
              <Button clickEvent={() => submit()} name="확인" />
              <button onClick={() => setIsOpen(false)}>
                <span>취소</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AwardBoardContainer>
  );
};
export default AwardBoard;
