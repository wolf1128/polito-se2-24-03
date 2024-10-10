import { useState, useRef } from 'react'
import Button from 'react-bootstrap/Button';
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import myIcon from '../../assets/Down_Arrow.svg';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../get-ticket.css';


function Ticket() {

    const [ticketNo, setTicketNo] = useState(110);
    const [waitingTime, setWaitingTime] = useState(0);
    const [serviceType, setServiceType] = useState("Service1");
    const [show, setShow] = useState(false);

    const target = useRef(null);

    const renderTooltip = (props: any) => (
        <Tooltip className="info-text" id="button-tooltip" {...props}>
          Hey! Select any service from<br/>
          below that you want to avail<br/>
          to get a ticket. If you need <br/>
          further help, call the staff.
        </Tooltip>
      );


    return (
        <>
            {/* Back Button */}
            <div className='back-button'>
                <Button className="btn btn-outline">Back</Button>
            </div>

            {/* Italian Post Office */}
            <div className='post-office'>
                <span className='post-office-icon'>
                    <MdOutlineLocalPostOffice size={60} />
                </span>  
                <span className='post-office-title'> 
                    Italian Post Office
                </span>              
            </div>

            {/* Info Button */}
            <div className='info'>
            <OverlayTrigger
                placement="bottom-start"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
                >
                <Button className='info-btn'>
                    <IoIosInformationCircleOutline size={28}/>
                </Button>
            </OverlayTrigger>
            </div>
            
            {/* Ticket Details */}
            <div className='ticket-details'>
                <span>
                    Ticket Details
                </span>
            </div>

            {/* Ticket Number Box */}
            <div className='ticket-box'>
                <span className='ticket-text'>
                    Your Ticket Number
                </span>
                <br/>
                <span className='ticket-number'>
                    {ticketNo}
                </span>
                
            </div>
            
            {/* Information Box */}
            <div className='information-box'>
                <div className='waiting-time'>
                    Waiting Time
                    <div className='waiting-time-number'>{waitingTime}</div>
                </div>
                <div className='service-type'>
                    Service Type
                    <div className='service-type-number'>{serviceType}</div>
                </div>
            </div>

            {/* Get Your Receipt */}
            <div className='get-receipt'>
                <span className='get-receipt-text'>
                    Get your Receipt
                </span>
                <br/>    
                <img src={myIcon} alt="My Local Icon" width="60" height="60" />
            </div>
        </>
    )
}

export default Ticket