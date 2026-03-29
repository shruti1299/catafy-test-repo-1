import Image, { StaticImageData } from 'next/image'
import { Progress, Rate } from 'antd'
import React from 'react'

interface IProps {
    type: 'low-stock' | 'top-selling'
    stock: {
        stockPercentage?: number;
        image: StaticImageData;
        title: string;
        stock?: string;
        rate?: number;
        price?: number;
        id?: number;
    }
}

const StocksList = ({ stock, type }: IProps) => {
    if (type === "low-stock")
        return (
            <div className={`flex w-full gap-3 items-center py-3 px-2 my-1 border border-transparent  rounded-md transition-all ease-in-out duration-200 cursor-pointer ${stock.stock === '0' ? "bg-red-100 hover:border-red-400" : 'hover:border-blue hover:bg-blue/5'}`}>
                <Image alt='image' src={stock.image} height={80} width={80} className='aspect-square' />
                <div className='flex flex-col gap-1 '>
                    <p className='text-sm font-semibold '>{stock.title}</p>
                    <Progress percent={stock.stockPercentage} showInfo={false} className='w-28' />
                    <p className={`text-sm font-semibold ${stock.stock === '0' ? "text-red-600" : ''}`}>{stock.stock === '0' ? 'Stock Out' : stock.stock + "more"}</p>
                </div>
            </div>
        )
    if (type === "top-selling")
        return (
            <div className={`flex w-full gap-3 items-center py-3 px-2 my-1 border border-transparent rounded-md transition-all ease-in-out duration-200 cursor-pointer hover:border-blue hover:bg-blue/5`}>
                <Image alt='image' src={stock.image} height={90} width={90} className='aspect-square' />
                <div className='flex flex-col gap-1 '>
                    <p className='text-sm font-semibold '>{stock.title}</p>
                    <Rate disabled defaultValue={stock.rate} />
                    <p className={`text-sm font-semibold`}>Rs. {stock.price}</p>
                </div>
            </div>
        )
}

export default StocksList