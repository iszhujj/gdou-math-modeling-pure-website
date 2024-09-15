import React,{memo} from 'react'

import LeaderTeacher from './LeaderTeacher/LeaderTeacher';
import Students from './Students/Students';


export default memo(()=>{
    return (
        <>
        <LeaderTeacher />
        <Students />
        </>
    )
})
