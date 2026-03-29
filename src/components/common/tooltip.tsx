import React, { ReactNode } from 'react'

interface IProps {
    children: ReactNode;
    className?: string;
    type?: 'navbar';
    text: string;
}

export const Tooltip = ({ children, text, type }: IProps) => {
    return (
        <div className="relative group ">
            {children}
            <div className={`absolute left-1/2  w-max transform-all ease-in-out -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-[#2D68FE] text-white text-xs font-semibold rounded py-1 px-2 ${type === 'navbar' && 'left-12 bg-[#070944]/60 backdrop-blur-md -top-3 place-content-center !text-sm px-4 translate-x-0 h-12 shadow-xl'}`}>
                <div className={`absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-[#2D68FE]/30 border-l-transparent border-r-transparent ${type === 'navbar' && '!top-5 !-left-1 border-l-[11px] border-r-[11px] border-t-[11px] rotate-90'}`} />
                {text}
            </div>
        </div>
    )
}
