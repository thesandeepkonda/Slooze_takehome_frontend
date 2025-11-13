package com.slooze.repo;

import com.slooze.model.User;
import com.slooze.model.Product;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public class InMemoryStore {
    public static Map<String, User> users = new ConcurrentHashMap<>();
    public static Map<String, String> sessions = new ConcurrentHashMap<>(); // token -> email
    public static Map<Long, Product> products = new ConcurrentHashMap<>();
    private static AtomicLong productId = new AtomicLong(1);

    static {
        // seed users
        users.put("manager@example.com", new User("manager@example.com", "manager123", "MANAGER"));
        users.put("keeper@example.com", new User("keeper@example.com", "keeper123", "STORE_KEEPER"));

        // seed products
        saveProduct(new Product(null, "Wheat", "Grain", 100, 20.0));
        saveProduct(new Product(null, "Sugar", "Sweetener", 50, 45.5));
        saveProduct(new Product(null, "Rice", "Grain", 200, 30.0));
    }

    public static Product saveProduct(Product p) {
        if (p.getId() == null) {
            p.setId(productId.getAndIncrement());
        }
        products.put(p.getId(), p);
        return p;
    }
}
