import styled from 'styled-components';

export const ClubMainContainer = styled.div`
  margin-left: 2.8vw;
  & > div:first-child {
    margin-bottom: 1.5rem;
    width: 55vw;
    height: 22.5rem;
    /* UI Properties */

    border-radius: 0px 0px 5px 5px;
    div {
      width: 55vw;
      height: 22.5rem;
      background: transparent linear-gradient(0deg, #eed090 0%, #eed090 15%, #ffe3a880 24%, #ffffff80 100%) 0% 0%
        no-repeat padding-box;
      border-radius: 0px 0px 5px 5px;
      opacity: 0.5;
      background-color: black;
    }
    img {
      width: 55vw;
      height: 22.5rem;
      border-radius: 0px 0px 5px 5px;
    }
  }
  & > div:last-child {
    margin-left: -20px;
  }
`;
