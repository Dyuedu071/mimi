package com.mimi.service;

import com.mimi.domain.Category;
import com.mimi.domain.User;
import com.mimi.domain.Voucher;
import com.mimi.domain.enums.Role;
import com.mimi.repository.CategoryRepository;
import com.mimi.repository.ProductRepository;
import com.mimi.repository.UserRepository;
import com.mimi.repository.VoucherRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DataInitializationService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final VoucherRepository voucherRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initializeData() {
        // Create default user if not exists
        if (userRepository.count() == 0) {
            User defaultUser = new User();
            defaultUser.setUsername("admin");
            defaultUser.setFullName("Admin User");
            defaultUser.setEmail("admin@mimi.com");
            defaultUser.setPassword("$2a$10$WtfQ7DJDfsVo7Xeg3cdIr.3pm4XXfdZXut5bQ91KKY/UOzWvZA8sW");
            defaultUser.setRole(Role.ADMIN);
            userRepository.save(defaultUser);
        }

    //     // Create default categories if not exist
        if (categoryRepository.count() == 0) {
            String[] categoryNames = {
                "Đồ chơi", "Quần áo", "Giày dép", "Xe đẩy", 
                "Bình sữa", "Tã bỉm", "Sữa bột", "Nôi cũi",
                "Ghế ăn dặm", "Đồ dùng tắm"
            };

            for (String name : categoryNames) {
                Category category = new Category();
                category.setName(name);
                categoryRepository.save(category);
            }
        }

    //     // Create sample products if not exist
    //     if (productRepository.count() == 0) {
    //         User defaultUser = userRepository.findAll().get(0);
    //         Category toyCategory = categoryRepository.findByName("Đồ chơi").orElse(categoryRepository.findAll().get(0));
    //         Category strollerCategory = categoryRepository.findByName("Xe đẩy").orElse(categoryRepository.findAll().get(0));
    //         Category chairCategory = categoryRepository.findByName("Ghế ăn dặm").orElse(categoryRepository.findAll().get(0));
    //         Category cribCategory = categoryRepository.findByName("Nôi cũi").orElse(categoryRepository.findAll().get(0));

    //         // Featured products
    //         Product product1 = new Product();
    //         product1.setName("Máy tiệt trùng bình sữa UV");
    //         product1.setDescription("Máy tiệt trùng hiện đại với công nghệ UV, an toàn cho bé");
    //         product1.setBuyPrice(new BigDecimal("1500000"));
    //         product1.setRentPrice(new BigDecimal("150000"));
    //         product1.setRentUnit(RentUnit.MONTH);
    //         product1.setTradeType(TradeType.BOTH);
    //         product1.setConditionPercentage(95);
    //         product1.setStatus(ProductStatus.ACTIVE);
    //         product1.setAddressContact("123 Nguyễn Văn Cừ, Q.5, TP.HCM");
    //         product1.setFeatured(true);
    //         product1.setIsNew(true);
    //         product1.setSeller(defaultUser);
    //         product1.setCategory(toyCategory);
    //         // Chỉ lưu tên file (backend GET /api/products/images/{filename} dùng filename)
    //         List<ProductImage> images1 = new ArrayList<>();
    //         images1.add(new ProductImage(null, product1,
    //                 "may-tiet-trung-binh-sua-co-say-kho-bang-tia-uv-spectra-1.jpg",
    //                 true));
    //         product1.setImages(images1);
    //         productRepository.save(product1);

    //         Product product2 = new Product();
    //         product2.setName("Máy hút sữa điện tử thông minh");
    //         product2.setDescription("Máy hút sữa với nhiều chế độ massage tự nhiên");
    //         product2.setBuyPrice(new BigDecimal("2000000"));
    //         product2.setRentPrice(new BigDecimal("200000"));
    //         product2.setRentUnit(RentUnit.MONTH);
    //         product2.setTradeType(TradeType.BOTH);
    //         product2.setConditionPercentage(98);
    //         product2.setStatus(ProductStatus.ACTIVE);
    //         product2.setAddressContact("456 Lê Văn Sỹ, Q.3, TP.HCM");
    //         product2.setFeatured(true);
    //         product2.setIsNew(false);
    //         product2.setSeller(defaultUser);
    //         product2.setCategory(toyCategory);
    //         List<ProductImage> images2 = new ArrayList<>();
    //         images2.add(new ProductImage(null, product2,
    //                 "May-hut-sua-dien-doi-Resonance-3-Fb1160VN-3.jpeg",
    //                 true));
    //         product2.setImages(images2);
    //         productRepository.save(product2);

    //         Product product3 = new Product();
    //         product3.setName("Nôi em bé thông minh");
    //         product3.setDescription("Nôi có chức năng ru tự động và phát nhạc");
    //         product3.setBuyPrice(new BigDecimal("5000000"));
    //         product3.setRentPrice(new BigDecimal("500000"));
    //         product3.setRentUnit(RentUnit.MONTH);
    //         product3.setTradeType(TradeType.BOTH);
    //         product3.setConditionPercentage(92);
    //         product3.setStatus(ProductStatus.ACTIVE);
    //         product3.setAddressContact("789 Võ Văn Tần, Q.3, TP.HCM");
    //         product3.setFeatured(true);
    //         product3.setIsNew(false);
    //         product3.setSeller(defaultUser);
    //         product3.setCategory(cribCategory);
    //         List<ProductImage> images3 = new ArrayList<>();
    //         images3.add(new ProductImage(null, product3,
    //                 "top-5-thuong-hieu-noi-cho-be-duoc-ua-chuong-nhat-hien-nay-2020-1595675197.png",
    //                 true));
    //         product3.setImages(images3);
    //         productRepository.save(product3);

    //         // New products
    //         Product product4 = new Product();
    //         product4.setName("Xe đẩy em bé cao cấp");
    //         product4.setDescription("Xe đẩy nhẹ, gấp gọn, phù hợp cho trẻ từ 0-3 tuổi");
    //         product4.setBuyPrice(new BigDecimal("3000000"));
    //         product4.setRentPrice(new BigDecimal("300000"));
    //         product4.setRentUnit(RentUnit.MONTH);
    //         product4.setTradeType(TradeType.BOTH);
    //         product4.setConditionPercentage(90);
    //         product4.setStatus(ProductStatus.ACTIVE);
    //         product4.setAddressContact("321 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM");
    //         product4.setFeatured(false);
    //         product4.setIsNew(true);
    //         product4.setSeller(defaultUser);
    //         product4.setCategory(strollerCategory);
    //         List<ProductImage> images4 = new ArrayList<>();
    //         images4.add(new ProductImage(null, product4,
    //                 "xe-day-tre-em-joie-versatrax-lagoon.jpg",
    //                 true));
    //         product4.setImages(images4);
    //         productRepository.save(product4);

    //         Product product5 = new Product();
    //         product5.setName("Ghế ăn dặm cho bé");
    //         product5.setDescription("Ghế ăn dặm an toàn, có thể điều chỉnh độ cao");
    //         product5.setBuyPrice(new BigDecimal("800000"));
    //         product5.setRentPrice(new BigDecimal("80000"));
    //         product5.setRentUnit(RentUnit.MONTH);
    //         product5.setTradeType(TradeType.BOTH);
    //         product5.setConditionPercentage(85);
    //         product5.setStatus(ProductStatus.ACTIVE);
    //         product5.setAddressContact("654 Cách Mạng Tháng 8, Q.10, TP.HCM");
    //         product5.setFeatured(false);
    //         product5.setIsNew(true);
    //         product5.setSeller(defaultUser);
    //         product5.setCategory(chairCategory);
    //         List<ProductImage> images5 = new ArrayList<>();
    //         images5.add(new ProductImage(null, product5,
    //                 "ghe-an-dam-umoo-1606186868.jpg",
    //                 true));
    //         product5.setImages(images5);
    //         productRepository.save(product5);

    //         Product product6 = new Product();
    //         product6.setName("Bộ đồ chơi giáo dục");
    //         product6.setDescription("Bộ đồ chơi phát triển trí tuệ cho trẻ 1-3 tuổi");
    //         product6.setBuyPrice(new BigDecimal("600000"));
    //         product6.setRentPrice(new BigDecimal("60000"));
    //         product6.setRentUnit(RentUnit.MONTH);
    //         product6.setTradeType(TradeType.BOTH);
    //         product6.setConditionPercentage(88);
    //         product6.setStatus(ProductStatus.ACTIVE);
    //         product6.setAddressContact("987 Nguyễn Thị Minh Khai, Q.1, TP.HCM");
    //         product6.setFeatured(false);
    //         product6.setIsNew(true);
    //         product6.setSeller(defaultUser);
    //         product6.setCategory(toyCategory);
    //         List<ProductImage> images6 = new ArrayList<>();
    //         images6.add(new ProductImage(null, product6,
    //                 "z6021933351086_28eb8d7e91cc13e47c6e338d1bea00f3.jpg",
    //                 true));
    //         product6.setImages(images6);
    //         productRepository.save(product6);
    //     }

    //     // Sample vouchers
        if (voucherRepository.count() == 0) {
            Voucher v1 = new Voucher();
            v1.setCode("GIAM50K");
            v1.setDiscountValue(new BigDecimal("50000"));
            v1.setMinOrderValue(new BigDecimal("200000"));
            v1.setExpirationDate(LocalDateTime.now().plusMonths(3));
            voucherRepository.save(v1);

            Voucher v2 = new Voucher();
            v2.setCode("FREESHIP");
            v2.setDiscountValue(new BigDecimal("30000"));
            v2.setMinOrderValue(new BigDecimal("300000"));
            v2.setExpirationDate(LocalDateTime.now().plusMonths(1));
            voucherRepository.save(v2);

            Voucher v3 = new Voucher();
            v3.setCode("TET2025");
            v3.setDiscountValue(new BigDecimal("100000"));
            v3.setMinOrderValue(new BigDecimal("500000"));
            v3.setExpirationDate(LocalDateTime.now().plusMonths(6));
            voucherRepository.save(v3);
        }
        
        // Initialize additional users
        initializeAdditionalUsers();
        initializeAdditionalUsers2();
    }
    
    private void initializeAdditionalUsers() {
        String[][] userData = {
           
  {
    "username": "189otc",
    "email": "189otc@gmail.com",
    "password": "123123",
    "fullName": "Lương Thái Dương",
    "phoneNumber": "0968864707",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "nguyentramy368222",
    "email": "nguyentramy368222@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Trà My",
    "phoneNumber": "0981268505",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "tuanson1092",
    "email": "tuanson1092@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Cao Tuấn Sơn",
    "phoneNumber": "0362347336",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "dongnvhe180365",
    "email": "dongnvhe180365@fpt.edu.vn",
    "password": "123123",
    "fullName": "Nguyễn Văn Đông",
    "phoneNumber": "0854675789",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "phunganh1912006",
    "email": "phunganh1912006@gmail.com",
    "password": "123123",
    "fullName": "Phùng Tú Anh",
    "phoneNumber": "0359063688",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "ntptrang207",
    "email": "ntptrang207@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Thị Phương Trang",
    "phoneNumber": "0981558207",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "duclinh26hg",
    "email": "duclinh26hg@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Hà Minh Đức",
    "phoneNumber": "0337270693",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "vuhoangtung1211",
    "email": "vuhoangtung1211@gmail.com",
    "password": "123123",
    "fullName": "Vũ Hoàng Tùng",
    "phoneNumber": "0337201556",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "nhid68313",
    "email": "nhid68313@gmail.com",
    "password": "123123",
    "fullName": "Đỗ Quỳnh Nhi",
    "phoneNumber": "0868088395",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "vungocmobeo",
    "email": "vungocmobeo@gmail.com",
    "password": "123123",
    "fullName": "Vũ Ngọc Hải Đăng",
    "phoneNumber": "0858194668",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "dattrinh2804",
    "email": "dattrinh2804@gmail.com",
    "password": "123123",
    "fullName": "Trịnh Thành Đạt",
    "phoneNumber": "0816535018",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "nguyentrananhdung291",
    "email": "nguyentrananhdung291@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Trần Anh Dũng",
    "phoneNumber": "0862787368",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "thuongntdhs186582",
    "email": "thuongntdhs186582@fpt.edu.vn",
    "password": "123123",
    "fullName": "Nguyễn Thị Đoàn Thương",
    "phoneNumber": "0985799130",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "bethinh3333",
    "email": "bethinh3333@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Ngọc Đức Thịnh",
    "phoneNumber": "0868597750",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "nguyenvuminhtrang1862007",
    "email": "nguyenvuminhtrang1862007@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Vũ Minh Trang",
    "phoneNumber": "0377176165",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "ngocanhhhh241105",
    "email": "ngocanhhhh241105@gmail.com",
    "password": "123123",
    "fullName": "Lê Ngọc Anh",
    "phoneNumber": "0968163504",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "nguyenvukhanhlinh2212",
    "email": "nguyenvukhanhlinh2212@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Vũ Khánh Linh",
    "phoneNumber": "0963756200",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "levanhung1752006",
    "email": "levanhung1752006@gmail.com",
    "password": "123123",
    "fullName": "Lê Văn Hùng",
    "phoneNumber": "0355324577",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "camlinhtrann239",
    "email": "camlinhtrann239@gmail.com",
    "password": "123123",
    "fullName": "Ngô Minh Quân",
    "phoneNumber": "0949554569",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "jeonjungshock19",
    "email": "jeonjungshock19@gmail.com",
    "password": "123123",
    "fullName": "Bùi Chi Linh",
    "phoneNumber": "0947722692",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "vu735558",
    "email": "vu735558@gmail.com",
    "password": "123123",
    "fullName": "Vũ Đình Hoàng",
    "phoneNumber": "0352491660",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "hoanganhquach817",
    "email": "hoanganhquach817@gmail.com",
    "password": "123123",
    "fullName": "QUÁCH HOÀNG ANH",
    "phoneNumber": "0966574603",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "ngoccyen06",
    "email": "ngoccyen06@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Ngọc Yến",
    "phoneNumber": "0983710620",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "hainamking2k7",
    "email": "hainamking2k7@gmail.com",
    "password": "123123",
    "fullName": "Đào Hải Nam",
    "phoneNumber": "0363828382",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "minhhoangaov",
    "email": "minhhoangaov@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Hoàng Minh",
    "phoneNumber": "0986082623",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "phamhuy08280",
    "email": "phamhuy08280@gmail.com",
    "password": "123123",
    "fullName": "Phạm Gia Huy",
    "phoneNumber": "0774341368",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "qtrang0110k6",
    "email": "qtrang0110k6@gmail.com",
    "password": "123123",
    "fullName": "Nguyễn Quỳnh Trang",
    "phoneNumber": "0368123190",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "canhavy24",
    "email": "canhavy24@gmail.com",
    "password": "123123",
    "fullName": "Cấn Thị Hà Vi",
    "phoneNumber": "0395230948",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "vh02012006",
    "email": "vh02012006@gmail.com",
    "password": "123123",
    "fullName": "Đỗ Bùi Việt Hoàng",
    "phoneNumber": "0965284598",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  },
  {
    "username": "chuongdangkt250",
    "email": "chuongdangkt250@gmail.com",
    "password": "123123",
    "fullName": "Đặng Hoàng Chương",
    "phoneNumber": "0339282991",
    "birthday": "2000-01-01",
    "address": "Hà Nội"
  }

           
        };
        
        int addedCount = 0;
        int skippedCount = 0;
        
        for (String[] data : userData) {
            String username = data[0];
            String email = data[1];
            String password = data[2];
            String fullName = data[3];
            String phoneNumber = data[4];
            String birthdayStr = data[5];
            String address = data[6];
            
            // Skip if email already exists
            if (userRepository.existsByEmail(email)) {
                skippedCount++;
                continue;
            }
            
            // Skip if username already exists
            if (userRepository.existsByUsername(username)) {
                skippedCount++;
                continue;
            }
            
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFullName(fullName);
            user.setPhoneNumber(phoneNumber);
            user.setBirthday(LocalDate.parse(birthdayStr));
            user.setAddress(address);
            user.setRole(Role.USER);
            
            userRepository.save(user);
            addedCount++;
        }
        
        System.out.println("User initialization completed: " + addedCount + " added, " + skippedCount + " skipped");
    }

    private void initializeAdditionalUsers2() {
        String[][] userData = {
            {"tqvhung217", "tqvhung217@gmail.com", "123123", "Tống Quang Việt Hưng", "0984433851", "2000-01-01", "Hà Nội"},
            {"hu08072007", "hu08072007@gmail.com", "123123", "Nguyễn Thị Thu Hương", "0828082286", "2000-01-01", "Hà Nội"},
            {"quynhx807", "quynhx807@gmail.com", "123123", "Trần Thị Như Quỳnh", "0916040483", "2000-01-01", "Hà Nội"},
            {"baoan199206", "baoan199206@gmail.com", "123123", "Quản Lưu Bảo An", "0923053319", "2000-01-01", "Hà Nội"},
            {"thangdqhe172702", "thangdqhe172702@fpt.edu.vn", "123123", "Đỗ Quyết Thắng", "0915694875", "2000-01-01", "Hà Nội"},
            {"trannamkhanh272006", "trannamkhanh272006@gmail.com", "123123", "Trần Nam Khánh", "0966054206", "2000-01-01", "Hà Nội"},
            {"nguyenthiquynhnhu14112006", "nguyenthiquynhnhu14112006@gmail.com", "123123", "Nguyễn Thị Quỳnh Như", "0984291283", "2000-01-01", "Hà Nội"},
            {"haianh6227", "haianh6227@gmail.com", "123123", "Đinh Hải Anh", "0868381029", "2000-01-01", "Hà Nội"},
            {"nguyenthuylinh261106", "nguyenthuylinh261106@gmail.com", "123123", "Nguyễn Thuỳ Linh", "0339008358", "2000-01-01", "Hà Nội"},
            {"phongnthe181783", "phongnthe181783@fpt.edu.vn", "123123", "Nguyễn Thanh Phong", "0366079769", "2000-01-01", "Hà Nội"},
            {"nzuyenkhanhly28007", "nzuyenkhanhly28007@gmail.com", "123123", "Nguyễn Khánh Ly", "0337067687", "2000-01-01", "Hà Nội"},
            {"lucikem27", "lucikem27@gmail.com", "123123", "Đỗ Thanh Thùy", "0359574633", "2000-01-01", "Hà Nội"},
            {"uyen09725", "uyen09725@gmail.com", "123123", "Nguyễn Phương Uyên", "0968880288", "2000-01-01", "Hà Nội"},
            {"uyen23112006", "uyen23112006@gmail.com", "123123", "Trần Phương Uyên", "0362749554", "2000-01-01", "Hà Nội"},
            {"uyenvuong523", "uyenvuong523@gmail.com", "123123", "Vương Mai Uyên", "0364579102", "2000-01-01", "Hà Nội"},
            {"nguyenthihue2592004", "nguyenthihue2592004@gmail.com", "123123", "Nguyễn Thị Huệ", "0904043529", "2000-01-01", "Hà Nội"},
            {"dophuongthao646", "dophuongthao646@gmail.com", "123123", "Đỗ Phương Thảo", "0325876970", "2000-01-01", "Hà Nội"},
            {"vn443487", "vn443487@gmail.com", "123123", "Nguyễn Quốc Vượng", "0376437206", "2000-01-01", "Hà Nội"},
            {"bimbim221107", "bimbim221107@gmail.com", "123123", "Đỗ Quý An", "0961323597", "2000-01-01", "Hà Nội"},
            {"ldaothi1111", "ldaothi1111@gmail.com", "123123", "Đào Thị Loan", "0868586206", "2000-01-01", "Hà Nội"},
            {"nguyenanhduc13082005", "nguyenanhduc13082005@gmail.com", "123123", "Nguyễn Anh Đức", "0964983507", "2000-01-01", "Hà Nội"},
            {"mchi712006", "mchi712006@gmail.com", "123123", "Hà Mai Chi", "0333569361", "2000-01-01", "Hà Nội"},
            {"nguyenmyy0704", "nguyenmyy0704@gmail.com", "123123", "Nguyễn Hà Hải My", "0967643900", "2000-01-01", "Hà Nội"},
            {"trkhoadang24", "trkhoadang24@gmail.com", "123123", "Trần Khoa Đăng", "0359468003", "2000-01-01", "Hà Nội"},
            {"bhien8151", "bhien8151@gmail.com", "123123", "Bùi Thị Hiền", "0399287400", "2000-01-01", "Hà Nội"},
            {"p_thuphuonq", "p.thuphuonq@gmail.com", "123123", "Phạm Thu Phương", "0865517780", "2000-01-01", "Hà Nội"},
            {"phamhoangthuong3", "phamhoangthuong3@gmail.com", "123123", "Phạm Thị Hoàng Thương", "0384353282", "2000-01-01", "Hà Nội"},
            {"nguyenanhq45", "nguyenanhq45@gmail.com", "123123", "Nguyễn Anh Quân", "0327161881", "2000-01-01", "Hà Nội"},
            {"gianhun83", "gianhun83@gmail.com", "123123", "Nguyễn Gia Như", "0915669126", "2000-01-01", "Hà Nội"},
            {"ductuannguyen8906", "ductuannguyen8906@gmail.com", "123123", "Nguyễn Đức Tuân", "0989860632", "2000-01-01", "Hà Nội"},
            {"shouldsmile135", "shouldsmile135@gmail.com", "123123", "Nguyễn Quang Minh", "0913181233", "2000-01-01", "Hà Nội"},
            {"www_hunglucky_05", "www.hunglucky.05@gmail.com", "123123", "Tạ Đức Hưng", "0342072676", "2000-01-01", "Hà Nội"},
            {"longhahoang14", "longhahoang14@gmail.com", "123123", "Hà Hoàng Long", "0918061005", "2000-01-01", "Hà Nội"},
            {"az_07062004", "az.07062004@gmail.com", "123123", "Trần Đức Minh", "0968785881", "2000-01-01", "Địa chỉ thường trú: Số nhà 5-Thôn Kỳ Thủy-Xã Bình Minh-Huyện Thanh Oai-Hà Nội"},
            {"tri82842006", "tri82842006@gmail.com", "123123", "Nguyễn Hữu Minh Trí", "0981190522", "2000-01-01", "Hà Nội"},
            {"ngankbabi1209", "ngankbabi1209@gmail.com", "123123", "Nguyễn Thị Kim Ngân", "0325761585", "2000-01-01", "Hà Nội"},
            {"phucthanh7733", "phucthanh7733@gmail.com", "123123", "Phạm Thuỳ Chi", "0963388297", "2000-01-01", "Hà Nội"},
            {"pngocbich2004", "pngocbich2004@gmail.com", "123123", "Phạm Ngọc Bích", "0974877850", "2000-01-01", "Hà Nội"},
            {"ddinhthaonguyen2512", "ddinhthaonguyen2512@gmail.com", "123123", "Đinh Thảo Nguyên", "0356031841", "2000-01-01", "Hà Nội"},
            {"thuyduongthuy8205", "thuyduongthuy8205@gmail.com", "123123", "Nguyễn Thuỳ Dương", "0981543438", "2000-01-01", "Hà Nội"},
            {"sitchs170349", "sitchs170349@fpt.edu.vn", "123123", "Trần Công Sĩ", "0356723294", "2000-01-01", "Hà Nội"},
            {"bakiennguyen288", "bakiennguyen288@gmail.com", "123123", "Nguyễn Thị Hương Ly", "0983566489", "2000-01-01", "Hà Nội"},
            {"nguyenlinh208205", "nguyenlinh208205@gmail.com", "123123", "Nguyễn Phương Linh", "0963430822", "2000-01-01", "Hà Nội"},
            {"vtlananh0311", "vtlananh0311@gmail.com", "123123", "Vũ Thị Lan Anh", "0382914211", "2000-01-01", "Hà Nội"},
            {"heekeysex", "heekeysex@gmail.com", "123123", "Nguyễn Thị Hồng Nhung", "0967291623", "2000-01-01", "Hà Nội"}
        };
        
        int addedCount = 0;
        int skippedCount = 0;
        
        for (String[] data : userData) {
            String username = data[0];
            String email = data[1];
            String password = data[2];
            String fullName = data[3];
            String phoneNumber = data[4];
            String birthdayStr = data[5];
            String address = data[6];
            
            // Skip if email already exists
            if (userRepository.existsByEmail(email)) {
                skippedCount++;
                continue;
            }
            
            // Skip if username already exists
            if (userRepository.existsByUsername(username)) {
                skippedCount++;
                continue;
            }
            
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFullName(fullName);
            user.setPhoneNumber(phoneNumber);
            user.setBirthday(LocalDate.parse(birthdayStr));
            user.setAddress(address);
            user.setRole(Role.USER);
            
            userRepository.save(user);
            addedCount++;
        }
        
        System.out.println("User initialization 2 completed: " + addedCount + " added, " + skippedCount + " skipped");
    }
}