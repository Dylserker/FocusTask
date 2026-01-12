import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

// Interface pour les erreurs API
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Interface pour l'état du hook
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

// Hook personnalisé pour gérer les appels API
export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Fonction pour exécuter une requête API
  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: ApiError) => void;
      showErrorToast?: boolean;
    }
  ): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await apiCall();
      setState({ data: response, loading: false, error: null });
      
      if (options?.onSuccess) {
        options.onSuccess(response);
      }
      
      return response;
    } catch (err) {
      const error = handleApiError(err);
      setState({ data: null, loading: false, error });
      
      if (options?.onError) {
        options.onError(error);
      }
      
      return null;
    }
  }, []);

  // Fonction pour réinitialiser l'état
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Fonction utilitaire pour gérer les erreurs API
function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    // Erreur axios avec réponse
    if (error.response) {
      return {
        message: error.response.data?.message || error.response.data?.error || 'Une erreur est survenue',
        status: error.response.status,
        errors: error.response.data?.errors,
      };
    }
    
    // Erreur axios sans réponse (problème réseau)
    if (error.request) {
      return {
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
        status: 0,
      };
    }
  }
  
  // Erreur générique
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  return {
    message: 'Une erreur inconnue est survenue',
  };
}

// Hook pour les mutations (POST, PUT, DELETE)
export function useMutation<TData = any, TVariables = any>() {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (
    apiCall: (variables: TVariables) => Promise<TData>,
    variables: TVariables,
    options?: {
      onSuccess?: (data: TData) => void;
      onError?: (error: ApiError) => void;
    }
  ): Promise<TData | null> => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await apiCall(variables);
      setState({ data: response, loading: false, error: null });
      
      if (options?.onSuccess) {
        options.onSuccess(response);
      }
      
      return response;
    } catch (err) {
      const error = handleApiError(err);
      setState({ data: null, loading: false, error });
      
      if (options?.onError) {
        options.onError(error);
      }
      
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

// Hook pour les requêtes avec cache simple
export function useQuery<T = any>(
  apiCall: () => Promise<T>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
  }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      setState({ data: response, loading: false, error: null });
      
      if (options?.onSuccess) {
        options.onSuccess(response);
      }
    } catch (err) {
      const error = handleApiError(err);
      setState({ data: null, loading: false, error });
      
      if (options?.onError) {
        options.onError(error);
      }
    }
  }, [apiCall, options]);

  // Auto-fetch si enabled
  React.useEffect(() => {
    if (options?.enabled !== false) {
      fetchData();
    }
  }, [options?.enabled, fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Export de React pour useEffect
import React from 'react';
