import { Modal } from 'antd';
import React from 'react'
import { ShareSocial } from 'react-share-social';

interface IProps{
    isOpen : boolean;
    setIsModalOpen:any;
    link:string;
}

export default function ShareLink({link, setIsModalOpen, isOpen}:IProps) {
  return (
    <Modal 
        title=""
        open={isOpen}
        footer={null}
        onClose={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <ShareSocial
          url={link}
          socialTypes={['facebook', 'twitter', 'reddit', 'linkedin', 'whatsapp']}
        />
      </Modal>
  )
}
