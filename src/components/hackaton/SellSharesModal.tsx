import { FC, useState } from "react";
import { Form, Offcanvas } from "react-bootstrap";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import { PortfolioSharesDto } from "../../pages/portfolio";
import Modal from 'react-bootstrap/Modal';

interface SellSharesDto {
  captableAddress: string;
	soldByAddress: string;
	price: number;
	numberOfShares : number;
}

export type SellSharesModalProps = {
  open: boolean;
  eth20Address: string | undefined
  selectedStock: PortfolioSharesDto | undefined;
  handleClose: () => void;
};

const SellSharesSidebar: FC<SellSharesModalProps> = ({
  open,
  eth20Address,
  selectedStock,
  handleClose,
}) => {
  const [price, setPrice] = useState<number>(0);
  const [numberOfShares, setNumberOfShares] = useState<number>(0);

  async function sellShares(e: any) {
    e.preventDefault();
    const sellRequest: SellSharesDto = {
      captableAddress: selectedStock?.captableAddress ?? "",
      numberOfShares: numberOfShares,
      price: price,
      soldByAddress: eth20Address ?? "",
    };

    try {
        const res = await fetch("/api/sell-shares", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sellRequest
            ),
        });

        if(res.status === 200) {
            const json = await res.json();
            console.log(json);
            toast(`${numberOfShares} aksjer fra ${selectedStock?.companyName} ble lagt til salgs`, { type: "success" });
            handleClose();
        }
        
    } catch (error) {
        console.log(error);
        toast("Kunne ikke opprette salgsordre!", { type: "error" });
    }

    console.log("sell now");
  }

  return (
    <Modal show={open} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter"
    centered >
      {/* <Offcanvas.Header closeButton>
        <Offcanvas.Title>Selg Aksje</Offcanvas.Title>
      </Offcanvas.Header> */}
      <Modal.Body className="hackaton-modal">
        <Row className="">
          <h3 className="sub-header-title mt-2">Selg aksjer</h3>
        </Row>
        <Row className="">
            <h5 className="hackaton-modal-company-name mb-5">{selectedStock?.companyName}</h5>
        </Row>
        <Form onSubmit={sellShares}>
          <Form.Group className="mb-3" controlId="formNumberOfShares">
            <Form.Label className="input-label">Antall aksjer du ønsker å selge</Form.Label>
            <Form.Control
              type="number"
              placeholder="1"
              onChange={(e) => setNumberOfShares(Number(e.target.value))}
              autoFocus
              className="input-box"
            />
            <Form.Text className="text-muted">
              Du eier {selectedStock?.numberOfShares} aksjer i dette selskapet.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPrice">
            <Form.Label className="input-label">Pris pr aksje</Form.Label>
            <Form.Control
              type="number"
              placeholder="1.00"
              onChange={(e) => setPrice(Number(e.target.value))}
              className="input-box"
            />
          </Form.Group>
          <Row className="justify-content-center mt-5"><Button variant="primary" type="submit" className="action-button me-2" style={{width: 132, height:48}}>
              Selg aksjer
            </Button>
            <Button variant="primary" className="action-button-secondary" style={{width: 99, height:48}} onClick={() => handleClose()}>
              Avbryt
            </Button></Row>
          {/* <div className="d-flex flex-row justify-content-center mt-5">
            
          </div> */}
        </Form>
        </Modal.Body> 
        </Modal>
  );
};

export default SellSharesSidebar;
