import React, { useEffect, useState } from 'react';
import AceEditor from "react-ace";

export default function Editor({ code, darkTheme, index, updateObjectInArray }) {

    const [val, setVal] = useState(code);
    const [theme, setTheme] = useState('one_dark');
    useEffect(() => {
        if (darkTheme) {
            setTheme('one_dark')
        }
        else {
            setTheme('solarized_light')
        }

    }, [darkTheme])
    const onChange = (code) => {
        setVal(code)
        updateObjectInArray(index, code)
    }
    return (
        <AceEditor
            mode="c_cpp"
            theme={theme}
            onChange={onChange}
            width={'100%'}
            value={val}
            fontSize={16}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: false }}
        />
    );
}