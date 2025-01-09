import {useState} from "react";
import {useConfiguratorStore} from "../store.js";

export const NameInput = () => {
    const updateCharacter = useConfiguratorStore(state => state.updateCharacter)
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    return <div>
        <h1>You need to input character name!</h1>
        {
            loading
                ? <h1>Loading</h1>
                : <>
                    <input style={{color: "black"}} value={name} onChange={(e) => {
                        setName(e.target.value)
                    }}/>
                    <button onClick={async () => {
                        setLoading(true);
                        try {
                            await updateCharacter({ name });
                        } finally {
                            setLoading(false);
                        }
                    }}>
                        Save
                    </button>
                </>
        }
    </div>
}