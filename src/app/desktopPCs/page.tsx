"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./DesktopPCs.module.scss";
import { supabase } from "../../lib/supabaseClient";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

// Тип для продукту
interface Product {
  id: number;
  name: string;
  image: string;
  stock: string;
  rating: number;
  price: number;
  category: string;
  color: string;
  priceRange: string;
  isNew?: boolean;
  description?: string;
  reviews: { count: number }[];
}

export default function DesktopPCs() {
  const [desktopPCs, setDesktopPCs] = useState<Product[]>([]);
  const [filteredDesktopPCs, setFilteredDesktopPCs] = useState<Product[]>([]);
  const [displayedDesktopPCs, setDisplayedDesktopPCs] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Стани для фільтрів
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState<string>("position");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Стани для пагінації
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Унікальні значення для фільтрів
  const [colors, setColors] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Завантаження даних із Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: desktopPCsData, error: desktopPCsError } = await supabase
          .from("products")
          .select(
            `
            *,
            reviews:reviews!product_id(count)
          `
          )
          .eq("category", "desktoppc");

        if (desktopPCsError) throw new Error(desktopPCsError.message);

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select(
            `
            *,
            reviews:reviews!product_id(count)
          `
          );

        if (productsError) throw new Error(productsError.message);

        const formattedDesktopPCs = (desktopPCsData || []).map((item: any) => ({
          ...item,
          reviews: item.reviews || [],
          priceRange: "",
          isNew: false,
        }));
        setDesktopPCs(formattedDesktopPCs);
        setFilteredDesktopPCs(formattedDesktopPCs);

        const prices = formattedDesktopPCs.map((pc: Product) => pc.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinPrice(min);
        setMaxPrice(max);
        setPriceRange([min, max]);

        const allProducts = (productsData || []).map((item: any) => ({
          ...item,
          reviews: item.reviews || [],
        }));
        setColors(
          Array.from(new Set(allProducts.map((p: Product) => p.color)))
        );
        setBrands(
          Array.from(
            new Set(allProducts.map((p: Product) => p.name.split(" ")[0]))
          )
        );
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Логіка фільтрування
  useEffect(() => {
    let filtered = [...desktopPCs];

    // Фільтр за ціною
    filtered = filtered.filter(
      (pc) => pc.price >= priceRange[0] && pc.price <= priceRange[1]
    );

    // Фільтр за кольорами
    if (selectedColors.length > 0) {
      filtered = filtered.filter((pc) => selectedColors.includes(pc.color));
    }

    // Фільтр за брендами
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((pc) => {
        const brand = pc.name.split(" ")[0];
        return selectedBrands.includes(brand);
      });
    }

    // Фільтр за наявністю
    if (inStockOnly) {
      filtered = filtered.filter((pc) => pc.stock === "in stock");
    }

    // Сортування
    if (sortOption === "price-low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high-low") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredDesktopPCs(filtered);
    setCurrentPage(1);
  }, [
    desktopPCs,
    priceRange,
    selectedColors,
    selectedBrands,
    inStockOnly,
    sortOption,
  ]);

  // Логіка пагінації
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedDesktopPCs(filteredDesktopPCs.slice(startIndex, endIndex));
  }, [filteredDesktopPCs, currentPage, itemsPerPage]);

  // Обробники для фільтрів
  const toggleFilter = (filterType: "color" | "brand", value: string) => {
    const setFilter =
      filterType === "color" ? setSelectedColors : setSelectedBrands;
    const currentFilters =
      filterType === "color" ? selectedColors : selectedBrands;

    if (currentFilters.includes(value)) {
      setFilter(currentFilters.filter((item) => item !== value));
    } else {
      setFilter([...currentFilters, value]);
    }
  };

  const clearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setSortOption("position");
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange([value[0], value[1]]);
    }
  };

  const handlePriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    const value = Number(e.target.value) || 0;
    if (type === "min") {
      setPriceRange([Math.min(value, priceRange[1]), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(value, priceRange[0])]);
    }
  };

  const totalPages = Math.ceil(filteredDesktopPCs.length / itemsPerPage);

  // Динамічні лічильники
  const getFilteredCount = (
    filterType: "color" | "brand" | "stock",
    value?: string
  ) => {
    let filtered = [...desktopPCs];

    filtered = filtered.filter(
      (pc) => pc.price >= priceRange[0] && pc.price <= priceRange[1]
    );

    if (filterType !== "color" && selectedColors.length > 0) {
      filtered = filtered.filter((pc) => selectedColors.includes(pc.color));
    }

    if (filterType !== "brand" && selectedBrands.length > 0) {
      filtered = filtered.filter((pc) => {
        const brand = pc.name.split(" ")[0];
        return selectedBrands.includes(brand);
      });
    }

    if (filterType !== "stock" && inStockOnly) {
      filtered = filtered.filter((pc) => pc.stock === "in stock");
    }

    if (filterType === "color" && value) {
      return filtered.filter((pc) => pc.color === value).length;
    }
    if (filterType === "brand" && value) {
      return filtered.filter((pc) => pc.name.split(" ")[0] === value).length;
    }
    if (filterType === "stock") {
      return filtered.filter((pc) => pc.stock === "in stock").length;
    }
    return 0;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className={styles.desktopPCsPage}>
      <section className={styles.topSection}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <Link href="/desktopPCs" className={styles.breadcrumbLink}>
            Desktop PCs
          </Link>
        </div>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Desktop PCs ({filteredDesktopPCs.length})
          </h1>
          <div className={styles.navControls}>
            <span className={styles.itemsCount}>
              Items {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredDesktopPCs.length)}{" "}
              of {filteredDesktopPCs.length}
            </span>
            <div className={styles.sortContainer}>
              <label className={styles.sortLabel}>Sort By:</label>
              <select
                className={styles.sortSelect}
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="position">Position</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className={styles.viewContainer}>
              <label className={styles.viewLabel}>Show:</label>
              <select
                className={styles.viewSelect}
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="35">35 per page</option>
              </select>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.gridViewButton} ${
                    viewMode === "grid" ? styles.active : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`${styles.listViewButton} ${
                    viewMode === "list" ? styles.active : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.filters}>
          <span className={styles.filtersLabel}>Filter</span>
          <div className={styles.filterButtons}>
            {priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? (
              <button
                className={styles.filterButton}
                onClick={() => setPriceRange([minPrice, maxPrice])}
              >
                Price: ${priceRange[0]} - ${priceRange[1]}
                <span className={styles.removeFilter}>×</span>
              </button>
            ) : null}
            {selectedColors.map((color) => (
              <button
                key={color}
                className={styles.filterButton}
                onClick={() => toggleFilter("color", color)}
              >
                {color} ({getFilteredCount("color", color)})
                <span className={styles.removeFilter}>×</span>
              </button>
            ))}
            {selectedBrands.map((brand) => (
              <button
                key={brand}
                className={styles.filterButton}
                onClick={() => toggleFilter("brand", brand)}
              >
                {brand} ({getFilteredCount("brand", brand)})
                <span className={styles.removeFilter}>×</span>
              </button>
            ))}
            {inStockOnly && (
              <button
                className={styles.filterButton}
                onClick={() => setInStockOnly(false)}
              >
                In Stock ({getFilteredCount("stock")})
                <span className={styles.removeFilter}>×</span>
              </button>
            )}
          </div>
          <button className={styles.clearFiltersButton} onClick={clearFilters}>
            Clear All
          </button>
        </div>
      </section>

      <section className={styles.mainSection}>
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <button className={styles.clearFilterButton} onClick={clearFilters}>
              Clear Filter
            </button>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Price</h3>
            <div className={styles.priceRange}>
              <Slider
                range
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={handlePriceRangeChange}
                trackStyle={[{ backgroundColor: "#007bff" }]}
                handleStyle={[
                  { borderColor: "#007bff", backgroundColor: "#fff" },
                  { borderColor: "#007bff", backgroundColor: "#fff" },
                ]}
              />
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceInputChange(e, "min")}
                  className={styles.priceInput}
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceInputChange(e, "max")}
                  className={styles.priceInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Color</h3>
            <ul className={styles.filterList}>
              <li className={styles.filterItem}>
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`${styles.colorCircle} ${
                      selectedColors.includes(color) ? styles.selected : ""
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => toggleFilter("color", color)}
                  ></div>
                ))}
              </li>
            </ul>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Availability</h3>
            <ul className={styles.filterList}>
              <li className={styles.filterItem}>
                <label>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  />
                  <span className={styles.filterName}>In Stock</span>
                  <span className={styles.filterCount}>
                    ({getFilteredCount("stock")})
                  </span>
                </label>
              </li>
            </ul>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Brands</h3>
            <ul className={styles.filterList}>
              {brands.map((brand) => (
                <li key={brand} className={styles.filterItem}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleFilter("brand", brand)}
                    />
                    <span className={styles.filterName}>{brand}</span>
                    <span className={styles.filterCount}>
                      ({getFilteredCount("brand", brand)})
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div
          className={`${styles.productsContainer} ${
            viewMode === "list" ? styles.listView : styles.gridView
          }`}
        >
          {displayedDesktopPCs.length > 0 ? (
            displayedDesktopPCs.map((desktopPC) => (
              <div
                key={desktopPC.id}
                className={
                  viewMode === "list" ? styles.listItem : styles.gridItem
                }
              >
                <ProductCard product={desktopPC} />
              </div>
            ))
          ) : (
            <p>No desktop PCs found.</p>
          )}
        </div>
      </section>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.pageButton}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
