import { FC } from "react";
import { Col, Row } from "react-bootstrap";

const HackatonFooter: FC = () => {
  return (
    <div className="hackaton-footer">
      
      <div className="footer-lower">
        <div className="w-100">

          <Col className="d-flex flex-row justify-content-start ps-5">
          <p style={{fontWeight: "bold"}}>© 2023 Unlisted</p>
          </Col>
          <Col className="d-flex flex-column" style={{paddingRight:250}}>
          <div className="hackaton-footer-upper">
        <p>Utviklet i sammarbeid av:</p>
      </div>
      <Row>
          <Col>
            <a
              href="https://www.unlisted.ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unlisted
            </a>
          </Col>
          <Col>
            <a
              href="https://www.sparebank1.no/nb/sr-bank/privat.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sparebank 1
            </a>
          </Col>
          <Col>
            <a
              href="https://www.sparebank1.no/"
              target="_blank"
              rel="noopener noreferrer"
            >
              SR-Bank
            </a>
          </Col>
          </Row>
          </Col>
          
        </div>
      </div>
    </div>
  );
};

export default HackatonFooter;
