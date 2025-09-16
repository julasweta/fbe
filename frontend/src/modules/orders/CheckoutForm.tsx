import React, { useEffect, useState } from "react";
import styles from "./CheckoutForm.module.scss";
import type { IArea, IBranch, ICity } from "../../interfaces/INovaPosta";
import { novaPoshtaService } from "../../services/NovaPostaService";
import { Select } from "../../components/ui/Select/Select";

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  areaRef?: string;
  cityRef?: string;
  cityName?: string;
  branchRef?: string;
  branchName?: string;
  novaPoshtaBranch?: string;
  city?: string;
}

interface CheckoutFormProps {
  form: CheckoutFormData;
  setForm: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ form, setForm }) => {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // Завантаження областей
  useEffect(() => {
    novaPoshtaService
      .getAreas()
      .then((res) => setAreas(res))
      .catch((err) => console.error("❌ Помилка завантаження областей:", err));
  }, []);

  // Завантаження міст
  useEffect(() => {
    if (!form.areaRef) return;
    setLoadingCities(true);
    novaPoshtaService
      .getCities(form.areaRef)
      .then((res) => setCities(res))
      .catch((err) => console.error("❌ Помилка завантаження міст:", err))
      .finally(() => setLoadingCities(false));
  }, [form.areaRef]);

  // Завантаження відділень
  useEffect(() => {
    if (!form.cityRef) return;
    setLoadingBranches(true);
    novaPoshtaService
      .getBranches(form.cityRef)
      .then((res) => setBranches(res))
      .catch((err) => console.error("❌ Помилка завантаження відділень:", err))
      .finally(() => setLoadingBranches(false));
  }, [form.cityRef]);

  const handleChangeValue = (
    name: "areaRef" | "cityRef" | "branchRef",
    value: string
  ) => {
    if (name === "areaRef") {
      setForm((prev) => ({
        ...prev,
        areaRef: value,
        cityRef: undefined,
        cityName: undefined,
        branchRef: undefined,
        branchName: undefined,
      }));
      setCities([]);
      setBranches([]);
    }

    if (name === "cityRef") {
      const city = cities.find((c) => c.Ref === value)?.Description || "";
      setForm((prev) => ({
        ...prev,
        cityRef: value,
        cityName: city,
        branchRef: undefined,
        branchName: undefined,
      }));
      setBranches([]);
    }

    if (name === "branchRef") {
      const branch = branches.find((b) => b.Ref === value);
      setForm((prev) => ({
        ...prev,
        branchRef: value,
        branchName: branch ? `${branch.Number} - ${branch.ShortAddress}` : "",
      }));
    }
  };

  return (
    <div className={styles.form}>
      <input
        type="text"
        name="fullName"
        placeholder="Ім’я та прізвище"
        value={form.fullName}
        onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Телефон"
        value={form.phone}
        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
      />

      <Select
        value={form.areaRef || ""}
        onChange={(value) => handleChangeValue("areaRef", value)}
        options={areas.map((area) => ({
          value: area.Ref,
          label: area.Description,
        }))}
        placeholder="Виберіть область"
      />

      <Select
        value={form.cityRef || ""}
        onChange={(value) => handleChangeValue("cityRef", value)}
        options={cities.map((city) => ({
          value: city.Ref,
          label: city.Description,
        }))}
        placeholder={loadingCities ? "Завантаження міст..." : "Виберіть місто"}
        disabled={!form.areaRef}
      />

      <Select
        value={form.branchRef || ""}
        onChange={(value) => handleChangeValue("branchRef", value)}
        options={branches.map((branch) => ({
          value: branch.Ref,
          label: `${branch.Number} - ${branch.ShortAddress}`,
        }))}
        placeholder={loadingBranches ? "Завантаження відділень..." : "Виберіть відділення"}
        disabled={!form.cityRef}
      />
    </div>
  );
};

export default CheckoutForm;





