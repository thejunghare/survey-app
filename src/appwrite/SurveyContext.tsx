import {ID, Permission, Role, Query} from "react-native-appwrite";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {databases} from "./service";
import {toast} from "./toast";

export const SURVEY_DATABASE_ID = "66502c6e0015d7be8526";
export const SURVEY_COLLECTION_ID = "6650391e00030acc335b";

interface SurveyData {
    employeeId: string;
    division: string;
    ward: string;
    type: string;
    area: string;
    building: string;
    familyhead: string;
    members: string;
    roomNumber: string;
    native: string;
    isRoomLocked: boolean;
    surveyRemark: string;
    surveyDenied: boolean;
    memberCount: string;
    createdAt: string;
    isOwner: boolean;
    isRented: boolean;
    roomOwnerMobileNumber: string;
    nameSource: string;
}

interface updateVoterData {
    education: string;
    native_place: string;
    mobile_number: string;
    caste: string;
    remark: string;
    survey_denied: boolean,
    is_rented: boolean,
    room_locked: boolean,
    is_owner: boolean,
}

interface SurveyContextProps {
    punchIn: (puchInData: AttendanceData) => Promise<void>;
    punchOut: (puchOutData: AttendanceData) => Promise<void>;
    current: SurveyData[];
    listLockedSurvey: (userId: string) => Promise<void>;
    fetchVoterList: Promise<void>;
    add: (survey: SurveyData) => Promise<void>;
    remove: (id: string) => Promise<void>;
    countDocument: (userId: string, date: string) => Promise<string>;
    roomLockedDocumentCount: (
        userId: string,
        isRoomLocked: boolean
    ) => Promise<string>;
    surveyDeniedDocumentCount: (
        userId: string,
        surveyDenied: boolean
    ) => Promise<string>;
}

const SurveyContext = createContext<SurveyContextProps | undefined>(undefined);

export function useSurvey(): SurveyContextProps {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error("useSurvey must be used within a SurveyProvider");
    }
    return context;
}

interface SurveyProviderProps {
    children: ReactNode;
}

interface Document {
    $id: string;
    title: string;
    employeeId: string;
    isRoomLocked: boolean;
    divison: string;
    ward: string;
    area: string;
    building: string;
}

interface AttendanceData {
    employeeId: String;
    dateTime: string;
    location: string;
    type: string;
}

export function SurveyProvider({children}: SurveyProviderProps) {
    const [surveys, setSurveys] = useState<SurveyData[]>([]);

    async function punchIn(punchInData: AttendanceData) {
        try {
            const response = await databases.createDocument(
                SURVEY_DATABASE_ID,
                '5',
                ID.unique(),
                punchInData,
            );
            console.log('Punched in successfully!', response);
            toast('Punched In!')
            return response;
        } catch (error) {
            console.error(error)
            toast('try again!')
        }
    }

    async function punchOut(punchOutData: AttendanceData) {
        try {
            const response = await databases.createDocument(
                SURVEY_DATABASE_ID,
                '5',
                ID.unique(),
                punchOutData,
            );
            console.log('Punched out successfully!', response);
            toast('Punched Out!')
            return response;
        } catch (error) {
            console.error(error)
            toast('try again!')
        }
    }

    // fetch voters
    /*async function fetchVoterList() {
        try {
            const result = await databases.listDocuments(
                SURVEY_DATABASE_ID,
                '66954dd3002fefd5a66f', // collection id
                [
                    Query.search('first_name', query)
                ]
            );
            return result.documents as Document[];
        } catch (error) {
            console.error('Error fetching voter list', error)
            toast('Error fetching!');
            return [];
        }
    }*/

    async function fetchVoterList(query: string) {
        try {
            const result = await databases.listDocuments(
                SURVEY_DATABASE_ID,
                '66954dd3002fefd5a66f', // collection id
                [
                    Query.search('first_name', query)
                ]
            );
            return result.documents;
        } catch (error) {
            console.error('Error fetching voter list', error);
            toast('Error fetching!');
            return [];
        }
    }


    // fetch locked rooms
    async function listLockedSurvey(userId: string, division: string, ward: string, area: string, building: string): Promise<Document[]> {
        try {
            const result = await databases.listDocuments(
                SURVEY_DATABASE_ID,
                SURVEY_COLLECTION_ID,
                [
                    Query.equal('employeeId', userId),
                    Query.equal('division', division),
                    Query.equal('ward', ward),
                    Query.equal('area', area),
                    Query.equal('building', building)
                ]
            );
            return result.documents as Document[];
        } catch (error) {
            //console.error('Error fetching locked rooms', error)
            toast('Error fetching!');
            return [];
        }
    };

    // add survey
    async function add(survey: SurveyData) {
        const response = await databases.createDocument(
            SURVEY_DATABASE_ID,
            SURVEY_COLLECTION_ID,
            ID.unique(),
            survey,
            [Permission.write(Role.user(survey.employeeId))]
        );
        toast("Survey added");
        setSurveys((prevSurveys) => [response, ...prevSurveys].slice(0, 10));
    }

    // update document
    async function update(documentId: string, updatedData: updateVoterData) {
        try {
            const response = await databases.updateDocument(
                SURVEY_DATABASE_ID, // databaseId
                '66954dd3002fefd5a66f', // collectionId
                documentId, // documentId
                updatedData, //data
                //[Permission.update(Role.user(updatedData.employeeId))] //permissions
            );
            console.info('Updated data!');
            toast('Updated!')
            return response;
        } catch (error) {
            toast('Error updating data!')
            console.error('Error updating data!', error);
        }
    }

    // fetch count for denied survey
    async function surveyDeniedDocumentCount(
        userId: string,
        surveyDenied: boolean,
        date: string
    ) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const startIsoString = startOfDay.toISOString();
        const endIsoString = endOfDay.toISOString();

        const response = await databases.listDocuments(
            SURVEY_DATABASE_ID,
            SURVEY_COLLECTION_ID,
            [
                Query.equal("employeeId", userId),
                Query.equal("surveyDenied", surveyDenied),
                Query.greaterThanEqual("createdAt", startIsoString),
                Query.lessThanEqual("createdAt", endIsoString),
            ]
        );
        return response.total;
    }

    // fetch locked room count
    async function roomLockedDocumentCount(
        userId: string,
        isRoomLocked: boolean,
        date: string
    ) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const startIsoString = startOfDay.toISOString();
        const endIsoString = endOfDay.toISOString();

        const response = await databases.listDocuments(
            SURVEY_DATABASE_ID,
            SURVEY_COLLECTION_ID,
            [
                Query.equal("employeeId", userId),
                Query.equal("isRoomLocked", isRoomLocked),
                Query.greaterThanEqual("createdAt", startIsoString),
                Query.lessThanEqual("createdAt", endIsoString),
            ]
        );
        return response.total;
    }

    //  fetch total doucment count
    async function countDocument(userId: string, date: string) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const startIsoString = startOfDay.toISOString();
        const endIsoString = endOfDay.toISOString();

        const response = await databases.listDocuments(
            SURVEY_DATABASE_ID,
            SURVEY_COLLECTION_ID,
            [
                Query.equal("employeeId", userId),
                Query.greaterThanEqual("createdAt", startIsoString),
                Query.lessThanEqual("createdAt", endIsoString),
            ]
        );

        return response.total;
    }

    // Remove document
    async function remove(id: string) {
        await databases.deleteDocument(
            SURVEY_DATABASE_ID,
            SURVEY_COLLECTION_ID,
            id
        );
        toast("Survey removed");
        setSurveys((prevSurveys) =>
            prevSurveys.filter((survey) => survey.$id !== id)
        );
        await init();
    }

    async function init() {
        const response = await databases.listDocuments(
            SURVEY_DATABASE_ID,
            SURVEY_COLLECTION_ID,
            [Query.orderDesc("$createdAt"), Query.limit(10)]
        );
        setSurveys(response.documents);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <SurveyContext.Provider
            value={{
                current: surveys,
                punchIn,
                punchOut,
                fetchVoterList,
                listLockedSurvey,
                add,
                update,
                remove,
                countDocument,
                roomLockedDocumentCount,
                surveyDeniedDocumentCount,
            }}
        >
            {children}
        </SurveyContext.Provider>
    );
}
