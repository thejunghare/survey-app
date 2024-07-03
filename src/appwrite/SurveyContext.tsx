import { ID, Permission, Role, Query } from "react-native-appwrite";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { databases } from "./service";
import { toast } from "./toast";

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
  memberCount:string;
  createdAt: string;
  isOwner: boolean;
  isRented: boolean;
  roomOwnerMobileNumber: string;
  nameSource:string;
}

interface SurveyContextProps {
  current: SurveyData[];
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

export function SurveyProvider({ children }: SurveyProviderProps) {
  const [surveys, setSurveys] = useState<SurveyData[]>([]);

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
        add,
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
