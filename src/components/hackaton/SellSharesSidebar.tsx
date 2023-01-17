import { FC, useState } from "react";
import { Form, Offcanvas } from "react-bootstrap";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import { PortfolioSharesDto } from "../../pages/portfolio";

interface SellSharesDto {
    captableAddress: string;
	soldByAddress: string;
	price: number;
	numberOfShares : number;
}

export type SellSharesSidebarProps = {
  open: boolean;
  eth20Address: string | undefined
  selectedStock: PortfolioSharesDto | undefined;
  handleClose: () => void;
};

const SellSharesSidebar: FC<SellSharesSidebarProps> = ({
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
    <Offcanvas show={open} onHide={handleClose} placement={"end"}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Selg Aksje</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row className="mb-3">
          <Col>
            <h5 className="company-name-sidebar">Selskaps navn:</h5>
          </Col>
          <Col lg={7}>
            <h5 className="company-name-sidebar">{selectedStock?.companyName}</h5>
          </Col>
        </Row>
        <Form onSubmit={sellShares}>
          <Form.Group className="mb-3" controlId="formNumberOfShares">
            <Form.Label>Antall aksjer du ønsker å selge</Form.Label>
            <Form.Control
              type="number"
              placeholder="1"
              onChange={(e) => setNumberOfShares(Number(e.target.value))}
            />
            <Form.Text className="text-muted">
              Du eier {selectedStock?.numberOfShares} aksjer i dette selskapet.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPrice">
            <Form.Label>Pris pr aksje</Form.Label>
            <Form.Control
              type="number"
              placeholder="1.00"
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </Form.Group>
          <div className="d-flex flex-row justify-content-center mt-5">
            <Button variant="primary" type="submit">
              Opprett salg
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SellSharesSidebar;
