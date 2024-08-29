// Import statements
import React, { useEffect, useState, useRef } from 'react';
import SPS, { User, SpsUser } from '../../SPS';
import UserTable from '../../components/table/UserTable';

interface UserProps {
    user: SpsUser;
    // sps: SPS;
    formInfo?: () => void;
}

const Users = (props: UserProps) => {
    // console.log('UserProps: ',props)
    const [users, setUsers] = useState<User[]>([]);
    // const [error, setError] = useState<string | null>(null);
    // const [hideObsolete, setHideObsolete] = useState<boolean>(true);

    const sps = useRef<SPS>(new SPS()); // kan evt. erstattes med props.sps
    
    useEffect(() => {
        const getDataFromSps = async () => {
            await sps.current.initialize(); // kan evt. erstattes med props.sps
            const usersGross: User[] = await sps.current.getAdminUsersData(); // kan evt. erstattes med props.sps
            // const usersGross: User[] = await sps.current.getOwnUserData(); // kan evt. erstattes med props.sps
            // const usersObsolete = hideObsolete ? usersGross.filter((o) => o.obsolete === false) : usersGross;

            setUsers(usersGross);
        };
        getDataFromSps();
    }, []);

// console.log('users: ',users)
    return (
        <>
            <section className="section">
                <div className="columns">
                    <div className="column is-full">
                        {users.length>0 && (
                        <UserTable 
                            users={users}
                            // project={project}
                            // setProject={setProject}
                            // standard_time={standard_time}
                            // setStandard_time={setStandard_time}
                            // deviations_time={deviations_time}
                            // setDeviations_time={setDeviations_time}
                            // working_time={working_time}
                            // setWorking_time={setWorking_time}                            
                            // obsolete={obsolete}
                            // setObsolete={setObsolete}
                            // onSave={onSave}
                            // setEditEntry={setEditEntry}
                            // resetForm={resetForm}
                            // setIsEditUserActive={setIsEditUserActive}
                            // error={error}
                            // setError={setError}
                        />)}
                        </div>
                            </div>
            </section>
        </>
    );
};

export default Users;