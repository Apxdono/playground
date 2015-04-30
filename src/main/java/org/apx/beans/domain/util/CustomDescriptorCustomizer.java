package org.apx.beans.domain.util;

import org.eclipse.persistence.config.SessionCustomizer;
import org.eclipse.persistence.descriptors.ClassDescriptor;
import org.eclipse.persistence.internal.helper.DatabaseField;
import org.eclipse.persistence.mappings.DatabaseMapping;
import org.eclipse.persistence.mappings.DirectToFieldMapping;
import org.eclipse.persistence.mappings.ManyToOneMapping;
import org.eclipse.persistence.mappings.OneToManyMapping;
import org.eclipse.persistence.sessions.Session;
import org.springframework.beans.BeanUtils;
import org.springframework.util.ReflectionUtils;

import java.beans.PropertyDescriptor;
import java.lang.reflect.AccessibleObject;
import java.util.Collection;
import java.util.Map;

/**
 * Created by oleg on 2/11/15.
 */
public class CustomDescriptorCustomizer implements SessionCustomizer {

    @Override
    public void customize(Session session) throws Exception {
//        Map<Class, ClassDescriptor> descs = session.getDescriptors();
//        Collection<ClassDescriptor> descriptors = descs.values();

//        // This code assumes single table per descriptor!
//        for (ClassDescriptor desc : descriptors) {
//            ColumnPrefix cp = (ColumnPrefix) desc.getJavaClass().getAnnotation(ColumnPrefix.class);
//            if (cp == null || "".equals(cp.value())) continue;
//            updateFieldNameMapping(cp.value() + "_", desc);
//        }

        // registering a sequence for system objects
        UUIDSequence sequence = new UUIDSequence("system-uuid");
        session.getLogin().addSequence(sequence);
    }

//    private void updateFieldNameMapping(String prefix, ClassDescriptor desc) {
//        // build name maps
//        for (DatabaseMapping mapping : desc.getMappings()) {
//            if (mapping.isDirectToFieldMapping()) {
//                DirectToFieldMapping directMapping = (DirectToFieldMapping) mapping;
//                makeField(mapping, directMapping.getField(), prefix);
//            }
//
//            if (mapping.isOneToManyMapping()) {
//                OneToManyMapping otmMapping = (OneToManyMapping) mapping;
//                if (otmMapping.getSourceKeysToTargetForeignKeys() != null) {
//                    for (Map.Entry<DatabaseField, DatabaseField> entry : otmMapping.getSourceKeysToTargetForeignKeys().entrySet()) {
//                        makeField(mapping,entry.getKey(), prefix);
//                    }
//                }
//            }
//            if (mapping.isManyToOneMapping()) {
//                ManyToOneMapping otmMapping = (ManyToOneMapping) mapping;
//                if (otmMapping.getSourceToTargetKeyFields() != null) {
//                    for (Map.Entry<DatabaseField, DatabaseField> entry : otmMapping.getSourceToTargetKeyFields().entrySet()) {
//                        makeField(mapping,entry.getKey(), prefix);
//                    }
//                }
//            }
//
//        }
//    }
//
//
//    private void makeField(DatabaseMapping m, DatabaseField df, String prefix) {
//        if (df.getName().startsWith(prefix)) return;
//        Class klass = m.getDescriptor().getJavaClass();
//        String fieldName = m.getAttributeName();
//        AccessibleObject ao = null;
//        if (m.isUsingMethodAccess()) {
//            PropertyDescriptor pd = BeanUtils.getPropertyDescriptor(klass, fieldName);
//            if (pd != null) {
//                ao = pd.getReadMethod();
//            }
//        } else {
//            ao = ReflectionUtils.findField(klass, fieldName);
//        }
//
//        if (ao != null && ao.isAnnotationPresent(IgnorePrefix.class)) return;
//
//        df.setName(prefix + df.getName());
//    }
//
//
//    private String camelCaseToUnderscore(String camelCase) {
//        return camelCase.trim().replaceAll("(?<!^)[A-Z](?!$)", "_$0").toLowerCase();
//    }


}
