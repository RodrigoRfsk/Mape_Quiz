import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: "BR", name: "Brasil", dial: "+55", flag: "🇧🇷" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "US", name: "Estados Unidos", dial: "+1", flag: "🇺🇸" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱" },
  { code: "CO", name: "Colômbia", dial: "+57", flag: "🇨🇴" },
  { code: "MX", name: "México", dial: "+52", flag: "🇲🇽" },
  { code: "PY", name: "Paraguai", dial: "+595", flag: "🇵🇾" },
  { code: "UY", name: "Uruguai", dial: "+598", flag: "🇺🇾" },
  { code: "PE", name: "Peru", dial: "+51", flag: "🇵🇪" },
  { code: "ES", name: "Espanha", dial: "+34", flag: "🇪🇸" },
  { code: "GB", name: "Reino Unido", dial: "+44", flag: "🇬🇧" },
  { code: "FR", name: "França", dial: "+33", flag: "🇫🇷" },
  { code: "DE", name: "Alemanha", dial: "+49", flag: "🇩🇪" },
  { code: "IT", name: "Itália", dial: "+39", flag: "🇮🇹" },
  { code: "CH", name: "Suíça", dial: "+41", flag: "🇨🇭" },
  { code: "AO", name: "Angola", dial: "+244", flag: "🇦🇴" },
  { code: "MZ", name: "Moçambique", dial: "+258", flag: "🇲🇿" },
];

const DEFAULT_COUNTRY = COUNTRIES[0];

const onlyDigits = (input: string): string => input.replace(/\D/g, "");

const formatBrazilian = (digits: string): string => {
  const capped = digits.slice(0, 11);
  if (capped.length === 0) return "";
  if (capped.length <= 2) return `(${capped}`;
  if (capped.length <= 7) return `(${capped.slice(0, 2)}) ${capped.slice(2)}`;
  return `(${capped.slice(0, 2)}) ${capped.slice(2, 7)}-${capped.slice(7)}`;
};

const formatNational = (digits: string, dial: string): string =>
  dial === "+55" ? formatBrazilian(digits) : digits.slice(0, 15);

const findByDial = (dial: string): Country =>
  COUNTRIES.find(country => country.dial === dial) ?? DEFAULT_COUNTRY;

interface ParsedPhone {
  country: Country;
  digits: string;
}

const parseValue = (value: string): ParsedPhone => {
  if (!value) return { country: DEFAULT_COUNTRY, digits: "" };

  const [maybeDial, ...rest] = value.trim().split(" ");
  if (maybeDial.startsWith("+")) {
    return { country: findByDial(maybeDial), digits: onlyDigits(rest.join(" ")) };
  }

  return { country: DEFAULT_COUNTRY, digits: onlyDigits(value) };
};

interface PhoneInputProps {
  value: string;
  onAnswer: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInput({
  value,
  onAnswer,
  placeholder,
}: PhoneInputProps) {
  const initial = parseValue(value);
  const [countryCode, setCountryCode] = useState<string>(initial.country.code);
  const [digits, setDigits] = useState<string>(initial.digits);

  const country =
    COUNTRIES.find(item => item.code === countryCode) ?? DEFAULT_COUNTRY;

  const emit = (nextDigits: string, dial: string) => {
    onAnswer(nextDigits ? `${dial} ${formatNational(nextDigits, dial)}` : "");
  };

  const handleCountryChange = (code: string) => {
    const next = COUNTRIES.find(item => item.code === code) ?? DEFAULT_COUNTRY;
    setCountryCode(code);
    emit(digits, next.dial);
  };

  const handleNumberChange = (raw: string) => {
    const nextDigits = onlyDigits(raw).slice(0, country.dial === "+55" ? 11 : 15);
    setDigits(nextDigits);
    emit(nextDigits, country.dial);
  };

  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[112px] shrink-0 border-2 border-border bg-transparent py-6 text-base focus:border-primary focus:ring-1 focus:ring-primary">
          <span className="flex items-center gap-2">
            <span className="text-lg leading-none">{country.flag}</span>
            <span>{country.dial}</span>
          </span>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {COUNTRIES.map(item => (
            <SelectItem key={item.code} value={item.code}>
              <span className="flex items-center gap-2">
                <span className="text-lg leading-none">{item.flag}</span>
                <span className="flex-1">{item.name}</span>
                <span className="text-muted-foreground">{item.dial}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="tel"
        inputMode="numeric"
        placeholder={placeholder}
        value={formatNational(digits, country.dial)}
        onChange={event => handleNumberChange(event.target.value)}
        className="flex-1 text-base py-6 px-4 border-2 border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary rounded-lg transition-all"
      />
    </div>
  );
}
