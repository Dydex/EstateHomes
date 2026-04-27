export default function Joke(props: any) {
    return (
        <>
        {props.setup && <p className="setup">Setup: {props.setup}</p> }
        <p className="punchline">Punchline: {props.punchline} </p>
        <hr />
        </>
    )
} 