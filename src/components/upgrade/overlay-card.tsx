import { Button } from "antd";

export default function OverlayCard() {
    return (
        <div className="card-overlay">
            <div className="text-center">
                <h2>Upgrade Your Plan</h2>
                <p>You’ve reached the maximum limit for your current plan.</p>
                <p>Upgrade to unlock more features and continue working without interruptions.</p>
                <Button type="primary">Upgrade Now</Button>
            </div>
        </div>
    )
}
