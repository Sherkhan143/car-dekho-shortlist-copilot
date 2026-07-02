/**
 * Real, hotlink-friendly car images sourced from Wikimedia Commons, keyed by
 * `${make} ${model}`. A few entries fall back to a platform sibling or an
 * older generation where a current India-spec photo was unavailable on
 * Commons (noted inline); swap these for exact images whenever you have them.
 */
export const carImages: Record<string, string> = {
  "Maruti Suzuki Swift":
    "https://upload.wikimedia.org/wikipedia/commons/3/3d/Suzuki_Swift_%282024%29_hybrid_DSC_6076.jpg",
  "Maruti Suzuki Baleno":
    "https://upload.wikimedia.org/wikipedia/commons/5/59/Suzuki_Baleno_front_20071004.jpg",
  "Maruti Suzuki Brezza":
    "https://upload.wikimedia.org/wikipedia/commons/e/ee/2022_Maruti_Suzuki_Brezza_ZXi%2B_%28India%29_front_view_03.png",
  // Grand Vitara photo shows the closely related global Suzuki Vitara.
  "Maruti Suzuki Grand Vitara":
    "https://upload.wikimedia.org/wikipedia/commons/7/7b/2024_Suzuki_Vitara_%284th_generation%29_DSC_6083.jpg",
  "Maruti Suzuki Ertiga":
    "https://upload.wikimedia.org/wikipedia/commons/f/f9/Suzuki_Ertiga_NC_FL_1.5_GLX_Hybrid_Snow_White_Pearl.jpg",
  "Hyundai i20":
    "https://upload.wikimedia.org/wikipedia/commons/e/ea/Hyundai_i20_%28III%2C_Facelift%29_%E2%80%93_f_11102025.jpg",
  "Hyundai Venue":
    "https://upload.wikimedia.org/wikipedia/commons/0/0c/2022_Hyundai_Venue_Preferred_in_Polar_White%2C_Front_Right%2C_09-12-2023.jpg",
  "Hyundai Creta":
    "https://upload.wikimedia.org/wikipedia/commons/2/25/2022_Hyundai_Creta_1.6_Plus_%28Chile%29_front_view.jpg",
  // Verna photo shows the previous-generation car (badged Accent abroad).
  "Hyundai Verna":
    "https://upload.wikimedia.org/wikipedia/commons/9/9d/2019_Hyundai_Accent_1.6L%2C_front_10.8.19.jpg",
  "Tata Nexon":
    "https://upload.wikimedia.org/wikipedia/commons/2/25/Tata_Nexon_Blue_Dual_Tone.jpg",
  "Tata Punch":
    "https://upload.wikimedia.org/wikipedia/commons/1/1e/2021_Tata_Punch_Creative_%28India%29_front_view_01.png",
  // Harrier photo shows the Buzzard Sport concept it is based on.
  "Tata Harrier":
    "https://upload.wikimedia.org/wikipedia/commons/c/c3/Tata_Buzzard_Sport%2C_GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS0651%29.jpg",
  "Tata Nexon EV":
    "https://upload.wikimedia.org/wikipedia/commons/2/25/Tata_Nexon_Blue_Dual_Tone.jpg",
  "Mahindra XUV700":
    "https://upload.wikimedia.org/wikipedia/commons/b/ba/2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png",
  // Scorpio-N photo shows the earlier Scorpio generation.
  "Mahindra Scorpio-N":
    "https://upload.wikimedia.org/wikipedia/commons/5/5b/Mahindra_Scorpio_GLX_2.6_m-Hawk_2011_%2836756517492%29.jpg",
  "Mahindra Thar":
    "https://upload.wikimedia.org/wikipedia/commons/5/51/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_02_%28cropped%29.jpg",
  // XUV3XO is the facelift of the XUV300 shown here.
  "Mahindra XUV3XO":
    "https://upload.wikimedia.org/wikipedia/commons/d/d4/Mahindra_XUV300.jpg",
  "Kia Seltos":
    "https://upload.wikimedia.org/wikipedia/commons/6/6c/Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg",
  "Kia Sonet":
    "https://upload.wikimedia.org/wikipedia/commons/7/75/2021_Kia_Sonet_1.5_Premiere_%28Indonesia%29_front_view_02.jpg",
  // Carens photo shows the older Rondo/Carens generation.
  "Kia Carens":
    "https://upload.wikimedia.org/wikipedia/commons/3/30/2016_Kia_Rondo_LX_Value_in_Sterling_Metallic%2C_Front_Right%2C_05-18-2023.jpg",
  "Toyota Innova Crysta":
    "https://upload.wikimedia.org/wikipedia/commons/3/36/Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg",
  "Toyota Innova Hycross":
    "https://upload.wikimedia.org/wikipedia/commons/3/36/Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg",
  "Toyota Fortuner":
    "https://upload.wikimedia.org/wikipedia/commons/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg",
  // Glanza is a rebadged Baleno.
  "Toyota Glanza":
    "https://upload.wikimedia.org/wikipedia/commons/9/96/2017_Suzuki_Baleno_SZ3_Dualjet_1.2_Front.jpg",
  "Honda City":
    "https://upload.wikimedia.org/wikipedia/commons/a/a9/2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg",
  "Honda Amaze":
    "https://upload.wikimedia.org/wikipedia/commons/2/25/Honda_Amaze_front_view_%28cropped%29.jpg",
  "Volkswagen Virtus":
    "https://upload.wikimedia.org/wikipedia/commons/9/9e/2022_Volkswagen_Virtus_1.5_GT_%28India%29_front_view_02.png",
  "Skoda Kushaq":
    "https://upload.wikimedia.org/wikipedia/commons/2/29/2021_%C5%A0koda_Kushaq_%28India%29_front_view.png",
  "Skoda Slavia":
    "https://upload.wikimedia.org/wikipedia/commons/9/92/2021_%C5%A0koda_Slavia_1.5_TSI_Style_%28India%29_front_view.png",
  // Hector is based on the Baojun 530 shown here.
  "MG Hector":
    "https://upload.wikimedia.org/wikipedia/commons/0/0f/2018_Baojun_530.jpg",
};

export default carImages;
