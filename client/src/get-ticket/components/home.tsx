import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../get-ticket.css';


function Home() {

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
                    Select a Service
                </span>
            </div>

            {/* Button Containers */}
            <div className='button-container'>
                <Button className='service-btn service-btn-01'>Service 01</Button>
                <Button className='service-btn service-btn-02'>Service 02</Button>
                <Button className='service-btn service-btn-04'>Service 04</Button>
                <Button className='service-btn service-btn-03'>Service 03</Button>
            </div>

            {/* Help Button */}
            <div className='help-box'>
                <Button className='help-btn'>Need Help?</Button>
            </div>


        </>
    )
}

export default Home