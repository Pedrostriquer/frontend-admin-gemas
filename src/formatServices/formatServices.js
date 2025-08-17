const formatServices = {
  formatCurrencyBR: (value) => {
    const number = Number(value);

    if (isNaN(number)) {
      return "0,00";
    }

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  },
  formatCpfCnpj: (value) => {
    if (!value) {
      return "";
    }

    const cleanedValue = String(value).replace(/\D/g, "");

    if (cleanedValue.length === 11) {
      return cleanedValue.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );
    }

    if (cleanedValue.length === 14) {
      return cleanedValue.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }

    return cleanedValue;
  },

  formatDocument: (value) => {
    if (!value || typeof value !== "string") {
      return value;
    }

    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length === 14) {
      return digitsOnly.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }

    if (digitsOnly.length === 11) {
      return digitsOnly.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, "");

    if (/[a-zA-Z]/.test(alphanumeric)) {
      return alphanumeric.toUpperCase();
    }
    return value;
  },
  formatData: (dateString) => {
    if (!dateString) {
      return "N/A";
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  },

  formatarPercentual: (valor) => {
    let valorStr = String(valor);
    valorStr = valorStr.replace(".", ",");
    valorStr = valorStr.replace(",", "#").replace(/,/g, "").replace("#", ",");
    if (!valorStr.includes("%")) {
      valorStr += "%";
    }
    return valorStr;
  },

  formatCurrencyInput: (value) => {
    if (!value) return "";

    const digitsOnly = value.toString().replace(/\D/g, "");
    if (digitsOnly === "") return "";

    const numberValue = parseInt(digitsOnly, 10) / 100;

    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  },

  parseCurrencyInput: (formattedValue) => {
    if (!formattedValue) return 0;

    const numericString = formattedValue
      .replace("R$", "")
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return parseFloat(numericString) || 0;
  },
  formatPhone: (value) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, "");
    const length = cleaned.length;

    if (length < 3) {
      return `(${cleaned}`;
    }
    if (length < 8) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }
    if (length < 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
        6
      )}`;
    }
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7,
      11
    )}`;
  },
};

export default formatServices;
