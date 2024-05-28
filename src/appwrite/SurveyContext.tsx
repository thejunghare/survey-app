import { ID, Permission, Role, Query } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { databases } from "./service";
import { toast } from "./toast";

export const SURVEY_DATABASE_ID: string = "66502c6e0015d7be8526";
export const SURVEY_COLLECTION_ID: string = "6650391e00030acc335b";

interface SurveyData {
  employeeId: string;
  division: string;
  ward: string;
  type: string;
  area:string;
  building:string;
  surveyData: string; // Your actual survey question-answer structure
}

interface SurveyContextProps {
  current: SurveyData[];
  add: (survey: SurveyData) => Promise<void>;
  remove: (id: string) => Promise<void>;
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
    toast('Survey added');
    setSurveys((surveys) => [response, ...surveys].slice(0, 10));
  }

  async function remove(id: string) {
    await databases.deleteDocument(SURVEY_DATABASE_ID, SURVEY_COLLECTION_ID, id);
    toast('Survey removed');
    setSurveys((surveys) => surveys.filter((survey) => survey.$id !== id));
    await init(); // Refetch surveys to ensure we have 10 items
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
    <SurveyContext.Provider value={{ current: surveys, add, remove }}>
      {children}
    </SurveyContext.Provider>
  );
}