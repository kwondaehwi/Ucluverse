import React, { ReactElement } from 'react';
import { useContext } from 'react';
import { ClubContext } from '../../../Pages/Club/Club';
import ClubBoard from '../Board/ClubBoard';
import { ClubMainContainer } from './style';

interface Props {
  clubId: number;
}
const ClubMain = (props: Props): ReactElement => {
  const { clubId } = props;
  const context = useContext(ClubContext);
  const club = context?.club;
  return (
    <ClubMainContainer>
      <div>{club?.logoPath ? <img src={club.logoPath} /> : <div></div>}</div>
      <ClubBoard boardIdx={0} clubId={clubId} boardName="전체 게시판" />
    </ClubMainContainer>
  );
};
export default ClubMain;
