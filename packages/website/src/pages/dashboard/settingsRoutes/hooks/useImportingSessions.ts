import {
  useGetSessionImportingContactsProcessInfoQuery,
  useGetSessionImportingContactsQuery,
  useImportingSessionsQuery,
  useUpdateImportingSessionMutation,
} from '@/graphql';
import { ImportingKeyIdentifierEnum } from '@helpers/enumTypes';
import { useEffect, useState } from 'react';

interface Props {
  importingIdentifier: ImportingKeyIdentifierEnum;
}

export const useImportingSessions = ({ importingIdentifier }: Props) => {
  const [pagination, setPagination] = useState({
    spoiledData: { page: 1, pageSize: 5 },
    completedData: { page: 1, pageSize: 5 },
    updatedData: { page: 1, pageSize: 5 },
  });

  const { data: lastSessions, refetch: refetchLastSession } =
    useImportingSessionsQuery({
      variables: {
        filters: {
          type: {
            eq: importingIdentifier,
          },
        },
        sort: ['createdAt:desc'],
        pagination: {
          limit: 1,
        },
      },
      pollInterval: 10000,
      fetchPolicy: 'network-only',
    });

  const generatedRegex =
    lastSessions?.importingSessions?.data?.[0]?.attributes?.regexedId;
  const sessionState =
    lastSessions?.importingSessions?.data?.[0]?.attributes?.state;

  const [updateImportingSession] = useUpdateImportingSessionMutation();

  const { data: sessionInfo, refetch: refetchSessionInfo } =
    useGetSessionImportingContactsProcessInfoQuery({
      variables: {
        input: {
          generatedRegex,
          importingIdentifier,
        },
      },

      fetchPolicy: 'network-only',
      pollInterval: sessionState === 'progressing' ? 3000 : 0,
    });

  const {
    data: sessionData,
    loading: sessionDataLoading,
    refetch: refetchSessionData,
  } = useGetSessionImportingContactsQuery({
    variables: {
      input: {
        generatedRegex,
        importingIdentifier,
        spoiledData: {
          page: pagination.spoiledData.page ?? 1,
          pageSize: pagination.spoiledData.pageSize ?? 5,
        },
        completedData: {
          page: pagination.completedData.page ?? 1,
          pageSize: pagination.completedData.pageSize ?? 5,
        },
        updatedData: {
          page: pagination.updatedData.page ?? 1,
          pageSize: pagination.updatedData.pageSize ?? 5,
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  const parsedData = JSON.parse(
    sessionData?.getSessionImportingContacts ?? '{}',
  );

  const updatePagination = (
    page: number,
    pageSize: number,
    key: keyof typeof pagination,
  ) => {
    setPagination((prev) => ({
      ...prev,
      [key]: { page, pageSize },
    }));
  };

  useEffect(() => {
    const processInfo = sessionInfo?.getSessionImportingContactsProcessInfo;
    const sessionId = lastSessions?.importingSessions?.data?.[0]?.id;

    if (
      processInfo?.processedFields &&
      processInfo?.totalFields &&
      sessionId &&
      processInfo?.processedFields >= processInfo?.totalFields
    ) {
      updateImportingSession({
        refetchQueries: ['sessionInfo', 'sessionData'],
        variables: {
          id: sessionId,
          input: {
            state: 'completed',
          },
        },
        onCompleted: () => {
          setTimeout(async () => {
            await refetchSessionData();
            await refetchSessionInfo();
          }, 0);
        },
      });
    }
  }, [
    sessionInfo,
    lastSessions,
    updateImportingSession,
    refetchSessionData,
    refetchSessionInfo,
  ]);

  return {
    lastSessions,
    sessionInfo,
    sessionData,
    parsedData,
    refetchLastSession,
    updatePagination,
    sessionDataLoading,
  };
};
