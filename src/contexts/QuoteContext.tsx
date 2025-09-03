import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface QuoteItem {
  id: string;
  productId: string;
  productName: string;
  brandName: string;
  smSku: string;
  primaryImageUrl?: string;
  quantity: number;
  lineNotes?: string;
  unitPrice?: number;
}

interface QuoteState {
  items: QuoteItem[];
  isOpen: boolean;
}

type QuoteAction =
  | { type: 'ADD_ITEM'; payload: Omit<QuoteItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_LINE_NOTES'; payload: { id: string; lineNotes: string } }
  | { type: 'CLEAR_QUOTE' }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'SET_DRAWER_OPEN'; payload: boolean }
  | { type: 'LOAD_FROM_STORAGE'; payload: QuoteItem[] };

const quoteReducer = (state: QuoteState, action: QuoteAction): QuoteState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity || 1;
        return { ...state, items: updatedItems };
      }
      
      const newItem: QuoteItem = {
        ...action.payload,
        quantity: action.payload.quantity || 1,
      };
      
      return { ...state, items: [...state.items, newItem] };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
      };
    
    case 'UPDATE_LINE_NOTES':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, lineNotes: action.payload.lineNotes }
            : item
        )
      };
    
    case 'CLEAR_QUOTE':
      return { ...state, items: [] };
    
    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen };
    
    case 'SET_DRAWER_OPEN':
      return { ...state, isOpen: action.payload };
    
    case 'LOAD_FROM_STORAGE':
      return { ...state, items: action.payload };
    
    default:
      return state;
  }
};

interface QuoteContextType {
  state: QuoteState;
  addItem: (item: Omit<QuoteItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateLineNotes: (id: string, lineNotes: string) => void;
  clearQuote: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  totalItems: number;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

const STORAGE_KEY = 'supply-ministry-quote';

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quoteReducer, {
    items: [],
    isOpen: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: items });
      }
    } catch (error) {
      console.error('Failed to load quote from storage:', error);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save quote to storage:', error);
    }
  }, [state.items]);

  const addItem = (item: Omit<QuoteItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const updateLineNotes = (id: string, lineNotes: string) => {
    dispatch({ type: 'UPDATE_LINE_NOTES', payload: { id, lineNotes } });
  };

  const clearQuote = () => {
    dispatch({ type: 'CLEAR_QUOTE' });
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleDrawer = () => {
    dispatch({ type: 'TOGGLE_DRAWER' });
  };

  const setDrawerOpen = (open: boolean) => {
    dispatch({ type: 'SET_DRAWER_OPEN', payload: open });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <QuoteContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        updateLineNotes,
        clearQuote,
        toggleDrawer,
        setDrawerOpen,
        totalItems,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};