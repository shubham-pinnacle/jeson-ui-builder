// shared helpers for dropdowns, date formatting, etc.

export const getOptions = (options: any): string[] => {
    if (Array.isArray(options)) {
      // Handle array of objects with title property
      return options.map(opt => {
        if (typeof opt === 'object' && opt !== null) {
          return opt.title || String(opt);
        }
        return String(opt);
      });
    }
    
    if (typeof options === 'string') {
      try {
        const parsed = JSON.parse(options);
        if (Array.isArray(parsed)) {
          // Handle array of objects with title property
          return parsed.map(opt => {
            if (typeof opt === 'object' && opt !== null) {
              return opt.title || String(opt);
            }
            return String(opt);
          });
        }
        return [];
      } catch {
        return [];
      }
    }
    return [];
  };
  
  export const formatDate = (date: string | number | Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };