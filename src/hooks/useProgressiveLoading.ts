import { useState } from 'react';

export interface LoadingSection {
  id: string;
  priority: number;
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ProgressiveLoadingState {
  sections: LoadingSection[];
  overallProgress: number;
  isFullyLoaded: boolean;
}

export const useProgressiveLoading = (sectionIds: string[]) => {
  const [loadingState, setLoadingState] = useState<ProgressiveLoadingState>({
    sections: sectionIds.map((id, index) => ({
      id,
      priority: index + 1,
      isLoaded: false,
      isLoading: false,
      error: null
    })),
    overallProgress: 0,
    isFullyLoaded: false
  });

  const startLoading = (sectionId: string) => {
    setLoadingState(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, isLoading: true }
          : section
      )
    }));
  };

  const finishLoading = (sectionId: string) => {
    setLoadingState(prev => {
      const updatedSections = prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, isLoading: false, isLoaded: true }
          : section
      );

      const loadedCount = updatedSections.filter(s => s.isLoaded).length;
      const overallProgress = (loadedCount / updatedSections.length) * 100;
      const isFullyLoaded = loadedCount === updatedSections.length;

      return {
        ...prev,
        sections: updatedSections,
        overallProgress,
        isFullyLoaded
      };
    });
  };

  const setError = (sectionId: string, error: string) => {
    setLoadingState(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, isLoading: false, error }
          : section
      )
    }));
  };

  const getNextSectionToLoad = (): LoadingSection | null => {
    return loadingState.sections.find(
      section => !section.isLoaded && !section.isLoading && !section.error
    ) || null;
  };

  const getSection = (sectionId: string): LoadingSection | undefined => {
    return loadingState.sections.find(section => section.id === sectionId);
  };

  return {
    loadingState,
    startLoading,
    finishLoading,
    setError,
    getNextSectionToLoad,
    getSection
  };
}; 