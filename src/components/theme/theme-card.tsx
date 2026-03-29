import { ITheme } from "@/interfaces/Store";
import "./theme.css";

export default function ThemeCard({theme}:{theme:ITheme}) {
    return (
        <div className="tm-body" style={{backgroundColor:theme.bg_color}}>
            <div className="tm-sidebar" style={{backgroundColor:theme.primary_color}}>
                <div className="icon"></div>
            </div>
            <div className="tm-container">
                {[1,2,3,4,5,6].map(m => 
                <div className="tm-card" key={m}>
                    <div className="image-placeholder"></div>
                    <h3>Best Selling | Promotion</h3>
                    <p>By, seller...</p>
                    <button style={{backgroundColor:theme.primary_color}}>Add to Cart</button>
                </div>
                )}
            </div>
        </div>
    )
}
